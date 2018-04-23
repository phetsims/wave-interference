// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen and other derivative screens.  This model supports two sources, even though the waves
 * screen only uses one.  The controls are in a metric coordinate frame, and there is a transformation to convert
 * metric coordinates to lattice coordinates.  On the view side there is another tranformation to move lattice or metric
 * coordinates to view coordinates.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntensitySample = require( 'WAVE_INTERFERENCE/common/model/IntensitySample' );
  var Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  var Property = require( 'AXON/Property' );
  var SceneType = require( 'WAVE_INTERFERENCE/common/model/SceneType' );
  var Util = require( 'DOT/Util' );
  var ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var POINT_SOURCE_HORIZONTAL_COORDINATE = 30;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function WavesScreenModel( options ) {

    var self = this;

    options = _.extend( {

      // This model supports one or two sources.  If sourceSeparation is 0, there is only one source
      sourceSeparation: 0
    }, options );

    // @public {Property.<ViewType>}
    this.viewTypeProperty = new Property( ViewType.TOP, {
      validValues: ViewType.VALUES
    } );

    // @public {Property.<number>} - transformation that converts from metric coordinates (considered to be the "model")
    //                             - to lattice coordinates (considered to be the "view")
    //                             - This transform changes when the scene changes.
    this.metricWidthOfVisibleLattice = new Property( 0.1 );

    this.metricUnits = new Property( 'cm' );

    // @public {Property.<number>} - scale factor that maps model time in seconds to time on the lattice
    this.modelTimeToLatticeTimeScaleFactor = 1;

    // @public {NumberProperty} - the frequency of the emitter in metric coordinates
    this.frequencyProperty = new NumberProperty( 1, {
      units: 'hertz'
    } );

    this.latticeFrequencyProperty = new DerivedProperty( [ this.frequencyProperty ], function( frequency ) {
      return frequency * self.modelTimeToLatticeTimeScaleFactor;
    } );

    // @public {NumberProperty} - controls the amplitude of the wave
    this.amplitudeProperty = new NumberProperty( 7 );

    // @public {NumberProperty} - the separation of the wave sources, or 0 if there is only one source
    this.sourceSeparationProperty = new NumberProperty( options.sourceSeparation );

    // @public {BooleanProperty} - whether the wave area graph should be displayed
    this.showGraphProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether the screen (on the right of the lattice) should be shown.
    this.showScreenProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether the intensity graph (on the right of the lattice) should be shown.
    this.showIntensityGraphProperty = new BooleanProperty( false );

    // @public {Property.<IncomingWaveType>} - pulse or continuous
    this.inputTypeProperty = new Property( IncomingWaveType.CONTINUOUS, {
      validValues: IncomingWaveType.VALUES
    } );

    // @public {Property.<PlaySpeedEnum>} - the speed at which the simulation is playing
    this.playSpeedProperty = new Property( PlaySpeedEnum.NORMAL, {
      validValues: PlaySpeedEnum.VALUES
    } );

    // @public {BooleanProperty} - whether the model is moving forward in time
    this.isRunningProperty = new BooleanProperty( true );

    // @public {Property.<SceneType>} - selected scene
    this.sceneProperty = new Property( SceneType.WATER, {
      validValues: SceneType.VALUES
    } );

    this.scaleIndicatorTextProperty = new DerivedProperty( [ this.sceneProperty ], _.property( 'scaleIndicatorText' ) );

    // @public {BooleanProperty} - whether the measuring tape has been dragged out of the toolbox into the play area
    this.isMeasuringTapeInPlayAreaProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - true if the timer is running
    this.isTimerRunningProperty = new BooleanProperty( false );

    // @public {NumberProperty} - time elapsed on the timer since it was last restarted
    this.timerElapsedTimeProperty = new NumberProperty( 0, {
      units: 'seconds'
    } );

    // @public {BooleanProperty} - true if the timer has been dragged out of the toolbox into the play area
    this.isTimerInPlayAreaProperty = new BooleanProperty( false );

    // @public
    this.isWaveDetectorToolNodeInPlayAreaProperty = new BooleanProperty( false );

    // @public - amount the 3d view is rotated. 0 means top view, 1 means side view.
    this.rotationAmountProperty = new NumberProperty( 0, {
      range: { min: 0, max: 1 }
    } );

    // @public {Emitter} - emits once per step
    this.stepEmitter = new Emitter();

    // @public {BooleanProperty} - true while a single pulse is being generated
    this.pulseFiringProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - true when the first source is continuously oscillating
    this.continuousWave1OscillatingProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - true when the second source is continuously oscillating
    this.continuousWave2OscillatingProperty = new BooleanProperty( false );

    // @public {Lattice} the grid that contains the wave values
    this.lattice = new Lattice( 100, 100, 20, 20 ); // Java was 60 + 20 padding on each side // TODO(design): evaluate dimensions

    // @public {IntensitySample} reads out the intensity on the right hand side of the lattice
    this.intensitySample = new IntensitySample( this.lattice );

    // @public {Property.<number>} - frequency in Hz
    // Blue light oscillates at 6.45 * 10^14 Hz
    // this.latticeFrequencyProperty = new Property( 6.45E14 );

    // @public {number} - elapsed time in seconds
    this.time = 0;

    // @public {number} phase of the emitter
    this.phase = 0;

    // @private {number} - track the time since the last lattice update so we can get comparable performance on machines with different speeds
    this.timeSinceLastLatticeStep = 0;

    // @public {Property.<Boolean>} - whether the button for the first source is pressed
    this.button1PressedProperty = new BooleanProperty( false );

    // @public {Property.<Boolean>} - whether the button for the second source is pressed
    this.button2PressedProperty = new BooleanProperty( false );

    // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
    // for continuity
    this.latticeFrequencyProperty.lazyLink( function( newFrequency, oldFrequency ) {
      var oldValue = Math.sin( self.time * oldFrequency + self.phase );
      var proposedPhase = Math.asin( oldValue ) - self.time * newFrequency;
      var oldDerivative = Math.cos( self.time * oldFrequency + self.phase );
      var newDerivative = Math.cos( self.time * newFrequency + proposedPhase );

      // If wrong phase, take the sin value from the opposite side and move forward by half a cycle
      if ( oldDerivative * newDerivative < 0 ) {
        proposedPhase = Math.asin( -oldValue ) - self.time * newFrequency + Math.PI;
      }

      self.phase = proposedPhase;

      // The wave area resets when the wavelength changes in the light scene
      if ( self.sceneProperty.get() === SceneType.LIGHT ) {
        self.clear();
      }
    } );

    // When the scene changes, the wave clears
    this.sceneProperty.link( function() {
      self.clear();
    } );

    // The first button can trigger a pulse, or continuous wave, depending on the inputTypeProperty
    this.button1PressedProperty.lazyLink( function( on ) {
      if ( on && self.inputTypeProperty.value === IncomingWaveType.PULSE ) {
        self.startPulse();
      }
      else {
        self.continuousWave1OscillatingProperty.value = on;
      }
    } );

    // The 2nd button starts the second continuous wave
    this.button2PressedProperty.lazyLink( function( on ) {
      self.continuousWave2OscillatingProperty.value = on;
    } );

    // When the pulse ends, the button pops out
    this.pulseFiringProperty.lazyLink( function( pulseFiring ) {
      if ( !pulseFiring ) {
        self.button1PressedProperty.value = false;
      }
    } );

    // When the user selects "PULSE", the button pops out.
    this.inputTypeProperty.link( function( inputType ) {
      if ( inputType === IncomingWaveType.PULSE ) {
        self.button1PressedProperty.value = false;
      }
    } );
  }

  waveInterference.register( 'WavesScreenModel', WavesScreenModel );

  return inherit( Object, WavesScreenModel, {

    /**
     * Clears the wave and the Intensity Sample
     * @public
     */
    clear: function() {
      this.lattice.clear();
      this.intensitySample.clear();
    },

    /**
     * Advance time by the specified amount
     * @param {number} dt - amount of time in seconds to move the model forward
     * @public
     */
    step: function( dt ) {

      // Animate the rotation, if it needs to rotate.  This is not subject to being paused, because we would like
      // students to be able to see the side view, pause it, then switch to the corresponding top view, and vice versa.
      var sign = this.viewTypeProperty.get() === ViewType.TOP ? -1 : +1;
      var newRotationAmount = Util.clamp( this.rotationAmountProperty.value + dt * sign * 1.4, 0, 1 );
      this.rotationAmountProperty.value = newRotationAmount;

      if ( this.isRunningProperty.get() ) {
        this.advanceTime( dt * this.playSpeedProperty.get().scaleFactor );
      }
    },

    /**
     * Additionally called from the "step" button
     * @param {number} dt - amount of time in seconds to move the model forward
     * @public
     */
    advanceTime: function( dt ) {
      var self = this;

      // On iPad2 and slower platforms, the clock speed cannot keep up with the frequency, so we must clamp the elapsed
      // time to get the full range of oscillation at the wave source.
      if ( dt > 1 / 60 ) {
        dt = 1 / 60;
      }
      this.time += dt;
      var continuous1 = ( this.inputTypeProperty.get() === IncomingWaveType.CONTINUOUS ) && this.continuousWave1OscillatingProperty.get();
      var continuous2 = ( this.inputTypeProperty.get() === IncomingWaveType.CONTINUOUS ) && this.continuousWave2OscillatingProperty.get();
      var entriesToSet = [];
      if ( continuous1 || continuous2 || this.pulseFiringProperty.get() ) {

        // TODO(design): a negative sign here will mean the water goes down first for a pulse, which makes sense
        // for a drop of water dropping in, but not desirable for how the graphs look (seems odd to dip down first)
        var v = -Math.sin( this.time * this.latticeFrequencyProperty.value + this.phase ) * this.amplitudeProperty.get();
        var separation = Math.floor( this.sourceSeparationProperty.get() / 2 );

        // Named with a "J" suffix instead of "Y" to remind us we are working in integral (i,j) lattice coordinates.
        var latticeCenterJ = Math.floor( this.lattice.height / 2 );

        // Point source
        if ( this.continuousWave1OscillatingProperty.get() || this.pulseFiringProperty.get() ) {
          entriesToSet.push( { i: POINT_SOURCE_HORIZONTAL_COORDINATE, j: latticeCenterJ + separation, value: v } );
        }

        // Secondary source (note if there is only one source, this sets the same value as above)
        if ( this.continuousWave2OscillatingProperty.get() ) {
          entriesToSet.push( { i: POINT_SOURCE_HORIZONTAL_COORDINATE, j: latticeCenterJ - separation, value: v } );
        }

        if ( this.time * this.latticeFrequencyProperty.value + this.phase > Math.PI * 2 ) {
          this.pulseFiringProperty.value = false;
        }
      }

      this.timeSinceLastLatticeStep += dt;

      if ( this.timeSinceLastLatticeStep >= 1 / 60 ) {
        var setEntry = function( entry ) {
          self.lattice.setCurrentValue( entry.i, entry.j, entry.value );
        };

        // Apply values before lattice step so the values will be used to propagate
        entriesToSet.forEach( setEntry );

        // Update the lattice
        this.lattice.step();

        // Apply values on top of the computed lattice values so there is no noise at the point sources
        entriesToSet.forEach( setEntry );

        this.timeSinceLastLatticeStep = 0;
        this.intensitySample.step();
      }
      if ( this.isTimerRunningProperty.get() ) {
        this.timerElapsedTimeProperty.set( this.timerElapsedTimeProperty.get() + dt );
      }

      // Notify listeners that a frame has advanced
      this.stepEmitter.emit();
    },

    /**
     * Start a single pulse when the user presses the pulse button in pulse mode.
     */
    startPulse: function() {
      assert && assert( !this.pulseFiringProperty.value, 'Cannot fire a pulse while a pulse is already being fired' );
      this.phase = -this.time * this.latticeFrequencyProperty.value; // start the sine angle at 0
      this.pulseFiringProperty.value = true;
    },

    /**
     * Restores the initial conditions
     * @public
     */
    reset: function() {

      // Reset latticeFrequencyProperty first because it changes the time and phase
      this.latticeFrequencyProperty.reset();
      this.time = 0;
      this.phase = 0;
      this.lattice.clear();
      this.sceneProperty.reset();
      this.viewTypeProperty.reset();
      this.latticeFrequencyProperty.reset();
      this.amplitudeProperty.reset();
      this.showGraphProperty.reset();
      this.inputTypeProperty.reset();
      this.playSpeedProperty.reset();
      this.isRunningProperty.reset();
      this.showScreenProperty.reset();
      this.rotationAmountProperty.reset();
      this.timerElapsedTimeProperty.reset();
      this.isTimerInPlayAreaProperty.reset();
      this.showIntensityGraphProperty.reset();
      this.isMeasuringTapeInPlayAreaProperty.reset();
      this.isWaveDetectorToolNodeInPlayAreaProperty.reset();
    }
  } );
} );