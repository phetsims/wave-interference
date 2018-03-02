// Copyright 2018, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/waves/model/PlaySpeedEnum' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );
  var WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  /**
   * @constructor
   */
  function TimeControlPanel( model, options ) {

    var radioButtonGroup = new WaveInterferenceVerticalAquaRadioButtonGroup( [ {
      node: new WaveInterferenceText( 'Normal' ),
      value: PlaySpeedEnum.NORMAL,
      property: model.playSpeedProperty
    }, {
      node: new WaveInterferenceText( 'Slow' ),
      value: PlaySpeedEnum.SLOW,
      property: model.playSpeedProperty
    } ] );

    var stepButton = new StepButton();

    // Only enable the step button when the model is paused.
    model.isRunningProperty.link( function( isRunning ) {
      stepButton.enabled = !isRunning;
    } );

    HBox.call( this, _.extend( {
      spacing: 20,
      children: [ new HBox( {
        spacing: 6,
        children: [ new PlayPauseButton( model.isRunningProperty ), stepButton ]
      } ), radioButtonGroup ]
    }, options ) );
  }

  waveInterference.register( 'TimeControlPanel', TimeControlPanel );

  return inherit( HBox, TimeControlPanel );
} );