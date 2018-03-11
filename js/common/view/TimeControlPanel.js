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
  var PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

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

    // @public (read-only) for layout
    this.playPauseButton = new PlayPauseButton( model.isRunningProperty );

    HBox.call( this, _.extend( {
      spacing: 20,
      children: [ new HBox( {
        spacing: 6,
        children: [ this.playPauseButton, stepButton ]
      } ), radioButtonGroup ]
    }, options ) );
  }

  waveInterference.register( 'TimeControlPanel', TimeControlPanel );

  return inherit( HBox, TimeControlPanel );
} );