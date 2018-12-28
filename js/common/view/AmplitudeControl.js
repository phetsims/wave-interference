// Copyright 2018, University of Colorado Boulder

/**
 * Controls the amplitude for each Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );

  class AmplitudeControl extends Node {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {
      super();

      this.addChild( new SceneToggleNode( model, scene => {

        // For water scene, control the desiredAmplitude (which determines the size of the water drops)
        // For other scenes, control the amplitude directly.
        return new WaveInterferenceSlider( scene.desiredAmplitudeProperty || scene.amplitudeProperty );
      } ) );
    }
  }

  return waveInterference.register( 'AmplitudeControl', AmplitudeControl );
} );