// Copyright 2018-2024, University of Colorado Boulder

/**
 * Controls the frequency for the selected Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SpectrumSliderThumb from '../../../../scenery-phet/js/SpectrumSliderThumb.js';
import SpectrumSliderTrack from '../../../../scenery-phet/js/SpectrumSliderTrack.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../WaveInterferenceUtils.js';
import WaveInterferenceSlider from './WaveInterferenceSlider.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const frequencyString = WaveInterferenceStrings.frequency;

// constants
const fromFemto = WaveInterferenceUtils.fromFemto;

class FrequencyControl extends Node {

  public constructor( model: WavesModel ) {

    const frequencyTitle = new WaveInterferenceText( frequencyString );

    const sliderGroupChildren = [];
    let soundFrequencySlider: WaveInterferenceSlider | null = null;

    // Controls are in the physical coordinate frame
    // @ts-expect-error
    if ( model.waterScene ) {

      // @ts-expect-error
      const waterFrequencySlider = new WaveInterferenceSlider( model.getWaterFrequencySliderProperty() );
      sliderGroupChildren.push( waterFrequencySlider );

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {

        // @ts-expect-error
        waterFrequencySlider.visible = scene === model.waterScene;
      } );
    }

    // @ts-expect-error
    if ( model.soundScene ) {

      // @ts-expect-error
      soundFrequencySlider = new WaveInterferenceSlider( model.soundScene.frequencyProperty );
      sliderGroupChildren.push( soundFrequencySlider );

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {

        // @ts-expect-error
        soundFrequencySlider.visible = scene === model.soundScene;
      } );
    }

    // @ts-expect-error
    if ( model.lightScene ) {

      // @ts-expect-error
      const lightFrequencyProperty = model.lightScene.frequencyProperty;
      const trackSize = new Dimension2( 150, WaveInterferenceConstants.SPECTRUM_TRACK_HEIGHT );
      const lightFrequencySlider = new WaveInterferenceSlider( lightFrequencyProperty, {

        // @ts-expect-error
        maxTickIndex: 25, // for audio clicks ratchet sounds
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

        // @ts-expect-error
        lightFrequencySlider.visible = scene === model.lightScene;
      } );

      sliderGroupChildren.push( lightFrequencySlider );
    }

    const sliderContainer = new Node( { children: sliderGroupChildren } );

    sliderContainer.top = frequencyTitle.bottom + WaveInterferenceUtils.getSliderTitleSpacing( frequencyTitle );

    // @ts-expect-error
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

waveInterference.register( 'FrequencyControl', FrequencyControl );
export default FrequencyControl;