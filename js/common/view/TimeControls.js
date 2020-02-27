// Copyright 2018-2020, University of Colorado Boulder

/**
 * Buttons for play/pause, and radio buttons for normal/slow
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import waveInterferenceStrings from '../../wave-interference-strings.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveInterferenceVerticalAquaRadioButtonGroup from './WaveInterferenceVerticalAquaRadioButtonGroup.js';

const normalString = waveInterferenceStrings.normal;
const slowString = waveInterferenceStrings.slow;

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

waveInterference.register( 'TimeControls', TimeControls );
export default TimeControls;