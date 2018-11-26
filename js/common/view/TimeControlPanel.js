// Copyright 2018, University of Colorado Boulder

/**
 * Buttons for play/pause radio buttons for normal/slow
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  // strings
  const normalString = require( 'string!WAVE_INTERFERENCE/normal' );
  const slowString = require( 'string!WAVE_INTERFERENCE/slow' );

  // constants
  const BUTTON_SCALE = 0.75;

  class TimeControlPanel extends HBox {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      const playPauseButton = new PlayPauseButton( model.isRunningProperty, {
        scale: BUTTON_SCALE
      } );

      const radioButtonGroup = new WaveInterferenceVerticalAquaRadioButtonGroup( [ {
        node: new WaveInterferenceText( normalString ),
        value: PlaySpeedEnum.NORMAL,
        property: model.playSpeedProperty
      }, {
        node: new WaveInterferenceText( slowString ),
        value: PlaySpeedEnum.SLOW,
        property: model.playSpeedProperty
      } ] );

      const stepButton = new StepButton( {
        scale: BUTTON_SCALE // TODO: can listener be inlined?
      } );

      // If we need to move forward further than one frame, call advanceTime several times rather than increasing the
      // dt, so the model will behave the same
      stepButton.addListener( () => model.advanceTime( 1 / WavesScreenModel.EVENT_RATE, true ) );

      // Only enable the step button when the model is paused.
      model.isRunningProperty.link( isRunning => {stepButton.enabled = !isRunning;} );

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