// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen.  TODO: rename and make more "common"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OscillationTypeEnum = require( 'WAVE_INTERFERENCE/common/model/OscillationTypeEnum' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  var Property = require( 'AXON/Property' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SceneTypeEnum' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/common/model/ViewTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WavesScreenModel() {

    var self = this;

    // @public
    this.viewTypeProperty = new Property( ViewTypeEnum.TOP, {
      validValues: ViewTypeEnum.VALUES
    } );

    // @public
    this.frequencyProperty = new NumberProperty( 6, {
      units: 'hertz'
    } );

    // @public
    this.amplitudeProperty = new NumberProperty( 6 );

    // @public
    this.showGraphProperty = new BooleanProperty( false );

    // @public
    this.inputTypeProperty = new Property( OscillationTypeEnum.CONTINUOUS, {
      validValues: OscillationTypeEnum.VALUES
    } );

    // @public
    this.playSpeedProperty = new Property( PlaySpeedEnum.NORMAL, {
      validValues: PlaySpeedEnum.VALUES
    } );

    // @public
    this.isRunningProperty = new BooleanProperty( true );

    // @public
    this.sceneProperty = new Property( SceneTypeEnum.WATER, {
      validValues: SceneTypeEnum.VALUES
    } );

    // @public
    this.isMeasuringTapeInPlayAreaProperty = new BooleanProperty( false );

    // @public
    this.isStopwatchRunningProperty = new BooleanProperty( false );

    // @public
    this.stopwatchElapsedTimeProperty = new NumberProperty( 0, {
      units: 'seconds'
    } );

    // @public
    this.isTimerInPlayAreaProperty = new BooleanProperty( false );

    // @public
    this.isChartToolNodeInPlayAreaProperty = new BooleanProperty( false );

    // @public
    this.stepEmitter = new Emitter();

    // TODO: clean
    // // Map from physical dimension units to lattice (dimensionless) units
    // this.amplitudeProperty.link( function( amplitude ) {
    //   self.waveInterferenceModel.amplitudeProperty.value = amplitude / 6 * 10;
    // } );
    //
    // // Wire up to the wave model
    // this.frequencyProperty.link( function( frequency ) {
    //   self.waveInterferenceModel.frequencyProperty.value = frequency * 2.5;
    // } );

    // @public
    var potential = function( i, j ) {
      return false;
      // return i === 60 && ((Math.abs( 40 - j ) > 3) && (Math.abs( 60 - j ) > 3));
    };

    // @public {Lattice} the grid that contains the wave values
    this.lattice = new Lattice( 100, 100, 20, 20, potential ); // Java was 60 + 20 padding on each side // TODO: evaluate dimensions

    // @public {number} elapsed time in seconds
    this.time = 0;

    // @public {number} phase of the emitter
    this.phase = 0;

    // @public {NumberProperty} the frequency of the emitter
    this.frequencyProperty = new NumberProperty( 20 );

    // @private - track the time since the last lattice update so we can get comparable performance on machines with different speeds
    this.timeSinceLastLatticeStep = 0;

    // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
    // for continuity
    this.frequencyProperty.lazyLink( function( newFrequency, oldFrequency ) {
      var oldValue = Math.sin( self.time * oldFrequency + self.phase );
      var proposedPhase = Math.asin( oldValue ) - self.time * newFrequency;
      var oldDerivative = Math.cos( self.time * oldFrequency + self.phase );
      var newDerivative = Math.cos( self.time * newFrequency + proposedPhase );

      // If wrong phase, take the asin value from the opposite side and move forward by half a cycle
      if ( oldDerivative * newDerivative < 0 ) {
        proposedPhase = Math.asin( -oldValue ) - self.time * newFrequency + Math.PI;
      }

      self.phase = proposedPhase;
    } );

    // @public {NumberProperty} controls the amplitude of the wave
    this.amplitudeProperty = new NumberProperty( 10 );
  }

  waveInterference.register( 'WavesScreenModel', WavesScreenModel );

  return inherit( Object, WavesScreenModel, {

    /**
     * Advance time by the specified amount
     * @param {number} dt - amount of time in seconds to move the model forward
     * @public
     */
    step: function( dt ) {
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

      // On iPad2 and slower platforms, the clock speed cannot keep up with the frequency, so we must clamp the elapsed
      // time to get the full range of oscillation at the wave source.
      if ( dt > 1 / 60 ) {
        dt = 1 / 60;
      }
      this.time += dt;
      if ( this.inputTypeProperty.get() === OscillationTypeEnum.CONTINUOUS || this.pulseRunning ) {
        var v = Math.sin( this.time * this.frequencyProperty.value + this.phase ) * this.amplitudeProperty.get();
        this.lattice.setCurrentValue( 30, 50, v );

        if ( this.time * this.frequencyProperty.value + this.phase > Math.PI * 2 ) {
          this.pulseRunning = false;
        }
      }

      this.timeSinceLastLatticeStep += dt;

      if ( this.timeSinceLastLatticeStep >= 1 / 60 ) {
        this.lattice.step();
        this.timeSinceLastLatticeStep = 0;
      }
      if ( this.isStopwatchRunningProperty.get() ) {
        this.stopwatchElapsedTimeProperty.set( this.stopwatchElapsedTimeProperty.get() + dt );
      }

      // Notify listeners that a frame has advanced
      this.stepEmitter.emit();
    },

    startPulse: function() {
      this.phase = -this.time * this.frequencyProperty.value; // start the sine angle at 0
      this.pulseRunning = true; // TODO: check pulseRunning was false
    },

    /**
     * Restores the initial conditions
     * @public
     */
    reset: function() {
      this.sceneProperty.reset();
      this.viewTypeProperty.reset();
      this.frequencyProperty.reset();
      this.amplitudeProperty.reset();
      this.showGraphProperty.reset();
      this.inputTypeProperty.reset();
      this.playSpeedProperty.reset();
      this.isRunningProperty.reset();
      this.isTimerInPlayAreaProperty.reset();
      this.stopwatchElapsedTimeProperty.reset();
      this.isMeasuringTapeInPlayAreaProperty.reset();
      this.isChartToolNodeInPlayAreaProperty.reset();

      // Reset frequencyProperty first because it changes the time and phase.
      this.frequencyProperty.reset();

      this.time = 0;
      this.phase = 0;

      this.lattice.clear();
    }
  } );
} );