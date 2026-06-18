// Copyright 2018-2026, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WavesModel from '../../waves/model/WavesModel.js';

class SlitsModel extends WavesModel {

  public constructor() {

    super( {
      initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max,

      waveSpatialType: 'plane',

      // SoundParticles are not displayed on the Slits screen,
      // see https://github.com/phetsims/wave-interference/issues/109
      showSoundParticles: false
    } );
  }

  /**
   * There are no water drops in this scene, and hence the slider controls the frequency directly.
   */
  public override getWaterFrequencySliderProperty(): NumberProperty {
    return this.waterScene!.frequencyProperty;
  }
}

export default SlitsModel;
