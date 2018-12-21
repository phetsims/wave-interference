// Copyright 2018, University of Colorado Boulder

/**
 * Controls the frequency for the selected Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const FrequencySlider = require( 'SCENERY_PHET/FrequencySlider' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  const fromFemto = WaveInterferenceUtils.fromFemto;

  class FrequencyControl extends Node {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {

      // Controls are in the physical coordinate frame
      const waterFrequencySlider = new WaveInterferenceSlider( model.getWaterFrequencySliderProperty() );
      const soundFrequencySlider = new WaveInterferenceSlider( model.soundScene.frequencyProperty );

      // For the light scene, create a Property in Hz as required by the FrequencySlider.
      const frequencyInHzProperty = new DynamicProperty( new Property( model.lightScene.frequencyProperty ), {
        bidirectional: true,
        map: frequency => WaveInterferenceUtils.fromFemto( frequency ),
        inverseMap: frequency => WaveInterferenceUtils.toFemto( frequency )
      } );

      const lightFrequencySlider = new FrequencySlider( frequencyInHzProperty, {
        minFrequency: fromFemto( model.lightScene.frequencyProperty.range.min ),
        maxFrequency: fromFemto( model.lightScene.frequencyProperty.range.max ),
        trackWidth: 150,
        trackHeight: 20,
        valueVisible: false,
        tweakersVisible: false,
        thumbWidth: 14,
        thumbHeight: 18
      } );

      lightFrequencySlider.centerTop = soundFrequencySlider.centerTop.plusXY( 0, 10 );

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {
        waterFrequencySlider.visible = scene === model.waterScene;
        soundFrequencySlider.visible = scene === model.soundScene;
        lightFrequencySlider.visible = scene === model.lightScene;
      } );

      super( {
        children: [
          waterFrequencySlider,
          soundFrequencySlider,
          lightFrequencySlider
        ]
      } );
    }
  }

  return waveInterference.register( 'FrequencyControl', FrequencyControl );
} );