// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var IncidentWaveTypeEnum = require( 'WAVE_INTERFERENCE/common/model/IncidentWaveTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  var Property = require( 'AXON/Property' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SceneTypeEnum' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/common/model/ViewTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceModel = require( 'WAVE_INTERFERENCE/common/model/WaveInterferenceModel' );

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
    this.inputTypeProperty = new Property( IncidentWaveTypeEnum.CONTINUOUS, {
      validValues: IncidentWaveTypeEnum.VALUES
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

    // @public {WaveInterferenceModel}
    this.waveInterferenceModel = new WaveInterferenceModel(); // todo: inheritance?  or sharing attributes?  Or good as is?

    // Map from physical dimension units to lattice (dimensionless) units
    this.amplitudeProperty.link( function( amplitude ) {
      self.waveInterferenceModel.amplitudeProperty.value = amplitude / 6 * 10;
    } );

    // Wire up to the wave model
    this.frequencyProperty.link( function( frequency ) {
      self.waveInterferenceModel.frequencyProperty.value = frequency * 2.5;
    } );
  }

  waveInterference.register( 'WavesScreenModel', WavesScreenModel );

  return inherit( Object, WavesScreenModel, {

    /**
     * Advance time by the specified amount
     * @public
     */
    step: function( dt ) {
      if ( this.isRunningProperty.get() ) {
        this.advanceTime( dt * this.playSpeedProperty.get().scaleFactor );
      }
    },

    /**
     * Additionally called from the "step" button
     * @param dt
     * @public
     */
    advanceTime: function( dt ) {

      // On iPad2 and slower platforms, the clock speed cannot keep up with the frequency, so we must clamp it
      // to get the full range of oscillation at the wave source.
      if ( dt > 1 / 60 ) {
        dt = 1 / 60;
      }
      this.waveInterferenceModel.step( dt );
      if ( this.isStopwatchRunningProperty.get() ) {
        this.stopwatchElapsedTimeProperty.set( this.stopwatchElapsedTimeProperty.get() + dt );
      }
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
    }
  } );
} );