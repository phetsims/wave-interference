// Copyright 2018, University of Colorado Boulder

/**
 * Buttons for play/pause radio buttons for normal/slow
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  // strings
  const normalString = require( 'string!WAVE_INTERFERENCE/normal' );
  const slowString = require( 'string!WAVE_INTERFERENCE/slow' );

  class TimeControlPanel extends HBox {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      const playPauseButton = new PlayPauseButton( model.isRunningProperty );

      const radioButtonGroup = new WaveInterferenceVerticalAquaRadioButtonGroup( [ {
        node: new WaveInterferenceText( normalString ),
        value: PlaySpeedEnum.NORMAL,
        property: model.playSpeedProperty
      }, {
        node: new WaveInterferenceText( slowString ),
        value: PlaySpeedEnum.SLOW,
        property: model.playSpeedProperty
      } ] );

      const stepButton = new StepButton();
      stepButton.addListener( function() {

        // If we need to move forward further than one frame, call advanceTime several times rather than increasing the
        // dt, so the model will behave the same
        model.advanceTime( 1 / 60 );
      } );

      // Only enable the step button when the model is paused.
      model.isRunningProperty.link( function( isRunning ) {
        stepButton.enabled = !isRunning;
      } );

      super( _.extend( {
        spacing: 20,
        children: [ new HBox( {
          spacing: 6,
          children: [ playPauseButton, stepButton ]
        } ), radioButtonGroup ]
      }, options ) );

      // @public (read-only) for layout
      this.playPauseButton = playPauseButton;
    }
  }

  return waveInterference.register( 'TimeControlPanel', TimeControlPanel );
} );