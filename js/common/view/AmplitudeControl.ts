// Copyright 2018-2022, University of Colorado Boulder

/**
 * Controls the amplitude for each Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaterScene from '../model/WaterScene.js';
import WaveInterferenceUtils from '../WaveInterferenceUtils.js';
import SceneToggleNode from './SceneToggleNode.js';
import WaveInterferenceSlider from './WaveInterferenceSlider.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const amplitudeString = WaveInterferenceStrings.amplitude;

class AmplitudeControl extends Node {

  public constructor( model: WavesModel ) {

    const amplitudeTitle = new WaveInterferenceText( amplitudeString );

    const sliderContainer = new SceneToggleNode( model, scene => {

      // For water scene, control the desiredAmplitude (which determines the size of the water drops)
      // For other scenes, control the amplitude directly.
      return new WaveInterferenceSlider( scene instanceof WaterScene ? scene.desiredAmplitudeProperty : scene.amplitudeProperty );
    } );

    sliderContainer.centerX = amplitudeTitle.centerX;
    sliderContainer.top = amplitudeTitle.bottom + WaveInterferenceUtils.getSliderTitleSpacing( amplitudeTitle );

    super( {
      children: [ amplitudeTitle, sliderContainer ]
    } );
  }
}

waveInterference.register( 'AmplitudeControl', AmplitudeControl );
export default AmplitudeControl;