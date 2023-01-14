// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Convenience class for the radio button group that chooses between SoundScene.SoundViewType.VALUES.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import SoundScene from '../model/SoundScene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WavesModel from '../../waves/model/WavesModel.js';

const bothString = WaveInterferenceStrings.both;
const particlesString = WaveInterferenceStrings.particles;
const wavesString = WaveInterferenceStrings.waves;

class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  public constructor( model: WavesModel ) {
    super( model.soundScene.soundViewTypeProperty, [ {
      createNode: () => new WaveInterferenceText( wavesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundScene.SoundViewType.WAVES
    }, {
      createNode: () => new WaveInterferenceText( particlesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundScene.SoundViewType.PARTICLES
    }, {
      createNode: () => new WaveInterferenceText( bothString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundScene.SoundViewType.BOTH
    } ], {
      spacing: 4,
      radioButtonOptions: {

        // Manually tuned so the radio buttons have the same width as the "Graph" checkbox
        radius: 6.5
      }
    } );
  }
}

waveInterference.register( 'SoundViewTypeRadioButtonGroup', SoundViewTypeRadioButtonGroup );
export default SoundViewTypeRadioButtonGroup;