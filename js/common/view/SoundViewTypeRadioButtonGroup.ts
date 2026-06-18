// Copyright 2018-2026, University of Colorado Boulder

/**
 * Convenience class for the radio button group that chooses between SoundScene.SoundViewType.VALUES.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import SoundScene from '../model/SoundScene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const bothString = WaveInterferenceStrings.both;
const particlesString = WaveInterferenceStrings.particles;
const wavesString = WaveInterferenceStrings.waves;

class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<IntentionalAny> {

  public constructor( model: WavesModel ) {

    // @ts-expect-error - soundScene is not typed on WavesModel, which still uses @ts-nocheck
    super( model.soundScene.soundViewTypeProperty, [ {
      createNode: () => new WaveInterferenceText( wavesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      // @ts-expect-error - SoundViewType is assigned at runtime and not typed on SoundScene, which still uses @ts-nocheck
      value: SoundScene.SoundViewType.WAVES
    }, {
      createNode: () => new WaveInterferenceText( particlesString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      // @ts-expect-error - SoundViewType is assigned at runtime and not typed on SoundScene, which still uses @ts-nocheck
      value: SoundScene.SoundViewType.PARTICLES
    }, {
      createNode: () => new WaveInterferenceText( bothString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      // @ts-expect-error - SoundViewType is assigned at runtime and not typed on SoundScene, which still uses @ts-nocheck
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

export default SoundViewTypeRadioButtonGroup;
