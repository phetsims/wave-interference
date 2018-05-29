// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen and other derivative screens.  This model supports two sources, even though the waves
 * screen only uses one.  The controls are in a metric coordinate frame, and there is a transformation to convert
 * metric coordinates to lattice coordinates.  On the view side there is another transformation to convert lattice or
 * metric coordinates to view coordinates.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntensitySample = require( 'WAVE_INTERFERENCE/common/model/IntensitySample' );
  var Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  var Property = require( 'AXON/Property' );
  var Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // strings
  var fiveHundredNanometersString = require( 'string!WAVE_INTERFERENCE/fiveHundredNanometers' );
  var oneCentimeterString = require( 'string!WAVE_INTERFERENCE/oneCentimeter' );
  var tenCentimetersString = require( 'string!WAVE_INTERFERENCE/tenCentimeters' );

  // constants
  var POINT_SOURCE_HORIZONTAL_COORDINATE = 30;
  var EVENT_RATE = 60;

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

    // TODO: docs for the scenes
    this.waterScene = new Scene( {
      verticalAxisTitle: 'Water Level',
      graphTitle: 'Water Level at Center',
      graphHorizontalAxisLabel: 'Position (cm)',
      name: 'WATER',
      latticeWidth: 0.1, // 10 centimeters
      minimumFrequency: 4,
      maximumFrequency: 20,
      scaleIndicatorText: oneCentimeterString,
      scaleIndicatorLength: 0.01, // 1 centimeter
      timeScaleFactor: 1,
      measuringTapeUnits: 'cm', // TODO: why is this abbrev while the meters is not?
      meterUnitsConversion: 0.01,
      timeUnitsConversion: 1,
      timerUnits: 's'
    } );

    var concertA = 440; // Hz
    this.soundScene = new Scene( {
      verticalAxisTitle: 'Pressure',
      graphTitle: 'Pressure at Center',
      graphHorizontalAxisLabel: 'Position (m)',
      name: 'SOUND',
      latticeWidth: 1, // 1 meter
      minimumFrequency: concertA - 200,
      maximumFrequency: concertA + 200,
      scaleIndicatorText: tenCentimetersString,
      scaleIndicatorLength: 0.1, // 10 cm
      timeScaleFactor: 5E-2, // This value is chosen to make the wave look accurate on the lattice
      measuringTapeUnits: 'meters',
      meterUnitsConversion: 1,
      timeUnitsConversion: 343 / 0.8 / 1.57, // This value is chosen so that the wave speed is accurate
      timerUnits: 'ms'
    } );

    this.lightScene = new Scene( {
      verticalAxisTitle: 'Electric Field',
      graphTitle: 'Electric Field at Center',
      graphHorizontalAxisLabel: 'Position (nm)',
      name: 'LIGHT',
      latticeWidth: 3789 * 1E-9, // tuned empirically so that the given light frequencies have the correct corresponding wavelengths
      minimumFrequency: VisibleColor.MIN_FREQUENCY,
      maximumFrequency: VisibleColor.MAX_FREQUENCY,
      initialFrequency: VisibleColor.SPEED_OF_LIGHT / 660E-9, // Start with red light because it is a familiar LED color
      scaleIndicatorText: fiveHundredNanometersString,
      scaleIndicatorLength: 500E-9, // 500nm
      timeScaleFactor: 4e-14, // Tuned empirically so the waves have the right size on the lattice.  TODO: is this truly a free parameter?
      measuringTapeUnits: 'nm',
      meterUnitsConversion: 1E-9,
      timeUnitsConversion: 1E15 * 0.15904736243338724, // Tuned empirically so that light would have the correct THz and hence the correct speed of light
      timerUnits: 'fs'
    } );

    var eventTimerModel = new EventTimer.ConstantEventModel( EVENT_RATE );

    // @private
    this.eventTimer = new EventTimer( eventTimerModel, function( timeElapsed ) {
      self.advanceTime( 1 / EVENT_RATE, timeElapsed );
    } );

    // @public {Property.<Scene>} - selected scene
    this.sceneProperty = new Property( this.waterScene, {
      validValues: [ this.waterScene, this.soundScene, this.lightScene ]
    } );

    // @public {NumberProperty} - the frequency of the emitter in Hz
    // TODO: do we need this property?  TODO: account for time scale in dt and stopwatch time
    this.frequencyProperty = new DynamicProperty( this.sceneProperty, {
      derive: 'frequencyProperty'
    } );

    // Show debugging information in the console when ?dev is selected
    if ( phet.chipper.queryParameters.dev ) {
      Property.multilink( [ this.frequencyProperty, this.sceneProperty ], function( frequency, scene ) {

        // Output in appropriate units
        if ( scene === self.lightScene ) {
          var speedOfLight = 299792458;
          var wavelength = speedOfLight / frequency;
          var frequencyTHz = frequency / 1E12;
          var wavelengthNM = wavelength / 1E-9;
          var oscillationFS = 1000 / frequencyTHz;
          console.log( 'Frequency = ' + frequencyTHz.toFixed( 2 ) + 'THz' + ', Wavelength = ' + wavelengthNM.toFixed( 2 ) + 'nm' + ' Time for one oscillation: ' + oscillationFS.toFixed( 2 ) + 'fs' );
        }
        else if ( scene === self.waterScene ) {
          console.log( 'Frequency = ' + frequency );
        }
      } );
    }

    // @public {NumberProperty} - controls the amplitude of the wave.  We optimize the view for the max, but starting
    // the value at the extreme may prevent the user from exploring the range, so we start closer to the max but not
    // at the max.  I chose 8 so it would match up directly with a tickmark (when it was at 7.5, it covered 2 tickmarks
    // and looked odd)
    this.amplitudeProperty = new NumberProperty( 8, { range: { min: 0, max: 10 } } );

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

    // @public {Property.<number>} - amount the 3d view is rotated. 0 means top view, 1 means side view.
    var rotationRange = { min: 0, max: 1 };
    this.rotationAmountProperty = new NumberProperty( 0, {
      range: rotationRange
    } );

    // @public {DerivedProperty.<boolean>} - true if the system is rotating
    this.isRotatingProperty = new DerivedProperty( [ this.rotationAmountProperty ], function( rotationAmount ) {
      return rotationAmount !== rotationRange.min && rotationAmount !== rotationRange.max;
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
    // TODO(after-webgl): evaluate dimensions.  Could increase to get better resolution or decrease to get better
    // TODO(after-webgl): performance.  Maybe choose our slowest device and tune it based on that.
    this.lattice = new Lattice( 100, 100, 20, 20 ); // Java was 60 + 20 padding on each side

    // @public {IntensitySample} reads out the intensity on the right hand side of the lattice
    this.intensitySample = new IntensitySample( this.lattice );

    // @public {number} - elapsed time in seconds
    this.time = 0;

    // @public {number} phase of the emitter
    this.phase = 0;

    // @public {Property.<Boolean>} - whether the button for the first source is pressed
    this.button1PressedProperty = new BooleanProperty( false );

    // @public {Property.<Boolean>} - whether the button for the second source is pressed
    this.button2PressedProperty = new BooleanProperty( false );

    // @public {Property.<Vector2>} - model for the view coordinates of the base of the measuring tape
    this.measuringTapeBasePositionProperty = new Property( new Vector2( 200, 200 ) );

    // @public {Property.<Vector2>} - model for the view coordinates of the tip of the measuring tape
    this.measuringTapeTipPositionProperty = new Property( new Vector2( 220, 200 ) );

    // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
    // for continuity
    this.frequencyProperty.lazyLink( function( newFrequency, oldFrequency ) {
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
      if ( self.sceneProperty.get() === self.lightScene ) {
        self.clear();
      }
    } );

    // When the scene changes, the wave clears and time resets.  This prevents a problem where the amplitude of the
    // emitter would get stuck when switching from water to light after 20 seconds.
    this.sceneProperty.link( function() {
      self.time = 0;
      self.clear();
      self.timerElapsedTimeProperty.reset(); // Timer units change when the scene changes, so we re-start the timer.
    } );

    // The first button can trigger a pulse, or continuous wave, depending on the inputTypeProperty
    this.button1PressedProperty.lazyLink( function( isPressed ) {
      if ( isPressed && self.inputTypeProperty.value === IncomingWaveType.PULSE ) {
        assert && assert( !self.pulseFiringProperty.value, 'Cannot fire a pulse while a pulse is already being fired' );
        self.resetPhase();
        self.pulseFiringProperty.value = true;
      }
      else {
        self.continuousWave1OscillatingProperty.value = isPressed;
        if ( isPressed ) {
          self.resetPhase();
        }
      }
    } );

    // The 2nd button starts the second continuous wave
    this.button2PressedProperty.lazyLink( function( isPressed ) {
      self.continuousWave2OscillatingProperty.value = isPressed;
      if ( isPressed ) {
        self.resetPhase();
      }
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

    // @public - Notifies listeners when the model reset is complete
    this.resetEmitter = new Emitter();
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
      this.eventTimer.step( dt );
    },

    /**
     * Additionally called from the "step" button
     * @param {number} dt - amount of time in seconds to move the model forward
     * @param {number} timeElapsed - see EventTimer, will be used if we need interpolation
     * @public
     */
    advanceTime: function( dt, timeElapsed ) {

      dt = dt * this.playSpeedProperty.get().scaleFactor; // TODO: is this the right place for that?

      // Animate the rotation, if it needs to rotate.  This is not subject to being paused, because we would like
      // students to be able to see the side view, pause it, then switch to the corresponding top view, and vice versa.
      var sign = this.viewTypeProperty.get() === ViewType.TOP ? -1 : +1;
      this.rotationAmountProperty.value = Util.clamp( this.rotationAmountProperty.value + dt * sign * 1.4, 0, 1 );

      if ( !this.isRunningProperty.get() ) {
        return;
      }

      dt = dt * this.sceneProperty.value.timeScaleFactor;

      this.time += dt;

      if ( this.pulseFiringProperty.get() && ( this.time * this.frequencyProperty.value + this.phase > Math.PI * 2 ) ) {
        this.pulseFiringProperty.value = false;
      }

      // Track the time since the last lattice update so we can get comparable performance on machines with different speeds

      // Update the lattice
      this.lattice.step( this.setSourceValues.bind( this ) );

      this.intensitySample.step();
      if ( this.isTimerRunningProperty.get() ) {
        this.timerElapsedTimeProperty.set( this.timerElapsedTimeProperty.get() + dt * this.sceneProperty.value.timeUnitsConversion );
      }

      // Notify listeners that a frame has advanced
      this.stepEmitter.emit();
    },

    /**
     * Start the sine argument at 0 so it will smoothly form the first wave.
     * @private
     */
    resetPhase: function() {
      this.phase = -this.time * this.frequencyProperty.value;
    },

    /**
     * Set the incoming source values, in this case it is a point source near the left side of the lattice (outside of the damping region).
     * @override
     * @protected
     */
    setSourceValues: function( lattice ) {
      var continuous1 = ( this.inputTypeProperty.get() === IncomingWaveType.CONTINUOUS ) && this.continuousWave1OscillatingProperty.get();
      var continuous2 = ( this.inputTypeProperty.get() === IncomingWaveType.CONTINUOUS ) && this.continuousWave2OscillatingProperty.get();

      if ( continuous1 || continuous2 || this.pulseFiringProperty.get() ) {

        // The simulation is designed to start with a downward wave, corresponding to water splashing in
        var v = -Math.sin( this.time * this.frequencyProperty.value + this.phase ) * this.amplitudeProperty.get();
        var separation = Math.floor( this.sourceSeparationProperty.get() / 2 );

        // Named with a "J" suffix instead of "Y" to remind us we are working in integral (i,j) lattice coordinates.
        var latticeCenterJ = Math.round( this.lattice.height / 2 );

        // Point source
        if ( this.continuousWave1OscillatingProperty.get() || this.pulseFiringProperty.get() ) {
          lattice.setCurrentValue( POINT_SOURCE_HORIZONTAL_COORDINATE, latticeCenterJ + separation, v );
        }

        // Secondary source (note if there is only one source, this sets the same value as above)
        if ( this.continuousWave2OscillatingProperty.get() ) {
          lattice.setCurrentValue( POINT_SOURCE_HORIZONTAL_COORDINATE, latticeCenterJ - separation, v );
        }
      }
    },

    /**
     * Restores the initial conditions
     * @public
     */
    reset: function() {

      // Reset frequencyProperty first because it changes the time and phase.  This is done by resetting each of the
      // frequencyProperties in the scenes
      this.waterScene.reset();
      this.soundScene.reset();
      this.lightScene.reset();

      this.time = 0;
      this.phase = 0;
      this.lattice.clear();
      this.sceneProperty.reset();
      this.viewTypeProperty.reset();
      this.amplitudeProperty.reset();
      this.showGraphProperty.reset();
      this.inputTypeProperty.reset();
      this.playSpeedProperty.reset();
      this.isRunningProperty.reset();
      this.showScreenProperty.reset();
      this.button1PressedProperty.reset();
      this.button2PressedProperty.reset();
      this.rotationAmountProperty.reset();
      this.timerElapsedTimeProperty.reset();
      this.isTimerInPlayAreaProperty.reset();
      this.showIntensityGraphProperty.reset();
      this.measuringTapeTipPositionProperty.reset();
      this.measuringTapeBasePositionProperty.reset();
      this.isMeasuringTapeInPlayAreaProperty.reset();
      this.continuousWave1OscillatingProperty.reset();
      this.continuousWave2OscillatingProperty.reset();
      this.isWaveDetectorToolNodeInPlayAreaProperty.reset();

      // Signify for listeners that the model reset is complete
      this.resetEmitter.emit();
    }
  } );
} );