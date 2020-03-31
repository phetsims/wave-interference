// Copyright 2018-2020, University of Colorado Boulder

/**
 * Convenience class for the radio button group that chooses between SoundScene.SoundViewType.VALUES.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import waveInterference from '../../waveInterference.js';
import SoundScene from '../model/SoundScene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const bothString = waveInterferenceStrings.both;
const particlesString = waveInterferenceStrings.particles;
const wavesString = waveInterferenceStrings.waves;

class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {WavesModel} model
   */
  constructor( model ) {
    super( model.soundScene.soundViewTypeProperty, [ {
      node: new WaveInterferenceText( wavesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundScene.SoundViewType.WAVES
    }, {
      node: new WaveInterferenceText( particlesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundScene.SoundViewType.PARTICLES
    }, {
      node: new WaveInterferenceText( bothString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
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