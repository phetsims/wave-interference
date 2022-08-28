// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Horizontal radio button group that selects Scene instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceSceneIcons from './WaveInterferenceSceneIcons.js';

class SceneRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param waterScene
   * @param soundScene
   * @param lightScene
   * @param sceneProperty
   */
  constructor( waterScene, soundScene, lightScene, sceneProperty ) {

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