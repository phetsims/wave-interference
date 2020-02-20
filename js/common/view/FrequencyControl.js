// Copyright 2018-2020, University of Colorado Boulder

/**
 * Controls the frequency for the selected Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SpectrumSliderThumb = require( 'SCENERY_PHET/SpectrumSliderThumb' );
  const SpectrumSliderTrack = require( 'SCENERY_PHET/SpectrumSliderTrack' );
  const Vector2 = require( 'DOT/Vector2' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
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

      const sliderGroupChildren = [];
      let soundFrequencySlider = null;

      // Controls are in the physical coordinate frame
      if ( model.waterScene ) {
        const waterFrequencySlider = new WaveInterferenceSlider( model.getWaterFrequencySliderProperty() );
        sliderGroupChildren.push( waterFrequencySlider );

        // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
        model.sceneProperty.link( scene => {
          waterFrequencySlider.visible = scene === model.waterScene;
        } );
      }
      if ( model.soundScene ) {
        soundFrequencySlider = new WaveInterferenceSlider( model.soundScene.frequencyProperty );
        sliderGroupChildren.push( soundFrequencySlider );

        // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
        model.sceneProperty.link( scene => {
          soundFrequencySlider.visible = scene === model.soundScene;
        } );
      }
      if ( model.lightScene ) {
        const lightFrequencyProperty = model.lightScene.frequencyProperty;
        const trackSize = new Dimension2( 150, WaveInterferenceConstants.SPECTRUM_TRACK_HEIGHT );
        const lightFrequencySlider = new WaveInterferenceSlider( lightFrequencyProperty, {
          maxTickIndex: 25,// for audio clicks ratchet sounds
          showTicks: false,
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

        lightFrequencySlider.centerTop = soundFrequencySlider ? soundFrequencySlider.centerTop.plusXY( 0, 10 ) :
                                         new Vector2( 0, 0 );

        // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
        model.sceneProperty.link( scene => {
          lightFrequencySlider.visible = scene === model.lightScene;
        } );

        sliderGroupChildren.push( lightFrequencySlider );
      }

      const sliderContainer = new Node( { children: sliderGroupChildren } );

      sliderContainer.top = frequencyTitle.bottom + WaveInterferenceUtils.getSliderTitleSpacing( frequencyTitle );
      if ( model.lightScene && !model.waterScene && !model.soundScene ) {
        sliderContainer.top += 10;
      }
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