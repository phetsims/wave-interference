// Copyright 2018-2026, University of Colorado Boulder

/**
 * Convenience class for the radio button group that chooses between SoundViewTypeValues.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import { SoundViewType } from '../model/SoundViewType.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<SoundViewType> {

  public constructor( model: WavesModel ) {

    super( model.soundScene!.soundViewTypeProperty, [ {
      createNode: () => new WaveInterferenceText( WaveInterferenceStrings.wavesStringProperty, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      value: 'waves'
    }, {
      createNode: () => new WaveInterferenceText( WaveInterferenceStrings.particlesStringProperty, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      value: 'particles'
    }, {
      createNode: () => new WaveInterferenceText( WaveInterferenceStrings.bothStringProperty, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),

      value: 'both'
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
