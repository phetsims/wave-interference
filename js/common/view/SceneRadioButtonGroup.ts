// Copyright 2018-2022, University of Colorado Boulder

/**
 * Horizontal radio button group that selects Scene instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceSceneIcons from './WaveInterferenceSceneIcons.js';
import SoundScene from '../model/SoundScene.js';
import LightScene from '../model/LightScene.js';
import WaterScene from '../model/WaterScene.js';
import Scene from '../model/Scene.js';
import Property from '../../../../axon/js/Property.js';

class SceneRadioButtonGroup extends RectangularRadioButtonGroup<Scene> {

  public constructor( waterScene: WaterScene, soundScene: SoundScene, lightScene: LightScene, sceneProperty: Property<Scene> ) {

    const waveInterferenceSceneIcons = new WaveInterferenceSceneIcons();

    super( sceneProperty, [
      { value: waterScene, createNode: tandem => waveInterferenceSceneIcons.waterIcon },
      { value: soundScene, createNode: tandem => waveInterferenceSceneIcons.soundIcon },
      { value: lightScene, createNode: tandem => waveInterferenceSceneIcons.lightIcon }
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