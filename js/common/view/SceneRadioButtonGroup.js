// Copyright 2018, University of Colorado Boulder

/**
 * Horizontal radio button group that selects Scene instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceSceneIcons = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSceneIcons' );

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

  return waveInterference.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );
} );