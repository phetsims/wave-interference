// Copyright 2018, University of Colorado Boulder

/**
 * Controls the frequency for the selected Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SpectrumSliderThumb = require( 'SCENERY_PHET/SpectrumSliderThumb' );
  const SpectrumSliderTrack = require( 'SCENERY_PHET/SpectrumSliderTrack' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // strings
  const frequencyString = require( 'string!WAVE_INTERFERENCE/frequency' );

  // constants
  const fromFemto = WaveInterferenceUtils.fromFemto;

  class FrequencyControl extends Node {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {

      const frequencyTitle = new WaveInterferenceText( frequencyString );

      // Controls are in the physical coordinate frame
      const waterFrequencySlider = new WaveInterferenceSlider( model.getWaterFrequencySliderProperty() );
      const soundFrequencySlider = new WaveInterferenceSlider( model.soundScene.frequencyProperty );

      const lightFrequencyProperty = model.lightScene.frequencyProperty;
      const trackSize = new Dimension2( 150, 20 );
      const lightFrequencySlider = new HSlider( lightFrequencyProperty, lightFrequencyProperty.range, {
        trackNode: new SpectrumSliderTrack( lightFrequencyProperty, lightFrequencyProperty.range, {
          valueToColor: f => VisibleColor.frequencyToColor( fromFemto( f ) ),
          size: trackSize
        } ),
        thumbNode: new SpectrumSliderThumb( lightFrequencyProperty, {
          valueToColor: f => VisibleColor.frequencyToColor( fromFemto( f ) ),
          width: 14,
          height: 18,
          cursorHeight: trackSize.height
        } )
      } );

      lightFrequencySlider.centerTop = soundFrequencySlider.centerTop.plusXY( 0, 10 );

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {
        waterFrequencySlider.visible = scene === model.waterScene;
        soundFrequencySlider.visible = scene === model.soundScene;
        lightFrequencySlider.visible = scene === model.lightScene;
      } );

      const sliderContainer = new Node( {
        children: [
          waterFrequencySlider,
          soundFrequencySlider,
          lightFrequencySlider ]
      } );

      sliderContainer.top = frequencyTitle.bottom + WaveInterferenceUtils.getSliderTitleSpacing( frequencyTitle );
      sliderContainer.centerX = frequencyTitle.centerX;

      super( {
        children: [
          frequencyTitle,
          sliderContainer
        ]
      } );
    }
  }

  return waveInterference.register( 'FrequencyControl', FrequencyControl );
} );