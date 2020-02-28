// Copyright 2018-2020, University of Colorado Boulder

/**
 * Horizontal radio button group that selects Scene instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceSceneIcons from './WaveInterferenceSceneIcons.js';

class SceneRadioButtonGroup extends RadioButtonGroup {

  /**
   * @param {Scene} waterScene
   * @param {Scene} soundScene
   * @param {Scene} lightScene
   * @param {Property.<Scene>} sceneProperty
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
      selectedStroke: '#73bce1',
      baseColor: 'white',
      selectedLineWidth: 2
    } );
  }
}

waveInterference.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );
export default SceneRadioButtonGroup;