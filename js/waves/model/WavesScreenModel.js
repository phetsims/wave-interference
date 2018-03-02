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
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/ViewTypeEnum' );
  var IncidentWaveTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/IncidentWaveTypeEnum' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/waves/model/PlaySpeedEnum' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/SceneTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WavesScreenModel() {

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
  }

  waveInterference.register( 'WavesScreenModel', WavesScreenModel );

  return inherit( Object, WavesScreenModel );
} );