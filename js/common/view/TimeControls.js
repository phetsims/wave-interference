// Copyright 2018-2019, University of Colorado Boulder

/**
 * Buttons for play/pause, and radio buttons for normal/slow
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );

  // strings
  const normalString = require( 'string!WAVE_INTERFERENCE/normal' );
  const slowString = require( 'string!WAVE_INTERFERENCE/slow' );

  // constants
  const BUTTON_SCALE = 0.75;

  class TimeControls extends HBox {

    /**
     * @param {WavesModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      const playPauseButton = new PlayPauseButton( model.isRunningProperty, {
        scale: BUTTON_SCALE
      } );

      const radioButtonGroup = new WaveInterferenceVerticalAquaRadioButtonGroup( model.playSpeedProperty, [ {
        node: new WaveInterferenceText( normalString ),
        value: WavesModel.PlaySpeed.NORMAL
      }, {
        node: new WaveInterferenceText( slowString ),
        value: WavesModel.PlaySpeed.SLOW
      } ] );

      const stepButton = new StepForwardButton( {
        scale: BUTTON_SCALE,

        // Only enable the step button when the model is paused.
        isPlayingProperty: model.isRunningProperty,

        // If we need to move forward further than one frame, call advanceTime several times rather than increasing the
        // dt, so the model will behave the same,
        // see https://github.com/phetsims/wave-interference/issues/254
        // and https://github.com/phetsims/wave-interference/issues/226
        listener: () => model.advanceTime( 1 / WavesModel.EVENT_RATE, true )
      } );

      super( merge( {
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

  return waveInterference.register( 'TimeControls', TimeControls );
} );