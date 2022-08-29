// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Horizontal radio button group that selects Scene instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import TProperty from '../../../../axon/js/TProperty.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceSceneIcons from './WaveInterferenceSceneIcons.js';
import SoundScene from '../model/SoundScene.js';
import LightScene from '../model/LightScene.js';
import WaterScene from '../model/WaterScene.js';
import Scene from '../model/Scene.js';

class SceneRadioButtonGroup extends RectangularRadioButtonGroup {

  public constructor( waterScene: WaterScene, soundScene: SoundScene, lightScene: LightScene, sceneProperty: TProperty<Scene> ) {

    const waveInterferenceSceneIcons = new WaveInterferenceSceneIcons();

    super( sceneProperty, [
      { value: waterScene, node: waveInterferenceSceneIcons.waterIcon },
      { value: soundScene, node: waveInterferenceSceneIcons.soundIcon },
      { value: lightScene, node: waveInterferenceSceneIcons.lightIcon }
    ], {
      orientation: 'horizontal',
      spacing: 15,
      radioButtonOptions: {
        baseColor: 'white',
        buttonAppearanceStrategyOptions: {
          selectedStroke: '#73bce1',
          selectedLineWidth: 2
        }
      }
    } );
  }
}

waveInterference.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );
export default SceneRadioButtonGroup;