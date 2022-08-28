// Copyright 2018-2020, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Scene from '../../common/model/Scene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../../waves/model/WavesModel.js';

class SlitsModel extends WavesModel {

  constructor() {
    super( {

      initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max,
      waveSpatialType: Scene.WaveSpatialType.PLANE,

      // SoundParticles are not displayed on the Slits screen,
      // see https://github.com/phetsims/wave-interference/issues/109
      showSoundParticles: false
    } );
  }

  /**
   * There are no water drops in this scene, and hence the slider controls the frequency directly.
   * @override
   * @public
   */
  getWaterFrequencySliderProperty() {
    return this.waterScene.frequencyProperty;
  }
}

waveInterference.register( 'SlitsModel', SlitsModel );
export default SlitsModel;