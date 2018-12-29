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
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // strings
  const amplitudeString = require( 'string!WAVE_INTERFERENCE/amplitude' );

  class AmplitudeControl extends Node {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {

      const amplitudeTitle = new WaveInterferenceText( amplitudeString );

      const sliderContainer = new SceneToggleNode( model, scene => {

        // For water scene, control the desiredAmplitude (which determines the size of the water drops)
        // For other scenes, control the amplitude directly.
        return new WaveInterferenceSlider( scene.desiredAmplitudeProperty || scene.amplitudeProperty );
      } );

      sliderContainer.centerX = amplitudeTitle.centerX;
      sliderContainer.top = amplitudeTitle.bottom + WaveInterferenceUtils.getSliderTitleSpacing( amplitudeTitle );

      super( {
        children: [ amplitudeTitle, sliderContainer ]
      } );
    }
  }

  return waveInterference.register( 'AmplitudeControl', AmplitudeControl );
} );