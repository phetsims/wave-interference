// Copyright 2018-2020, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders--but note that light frequency slider uses spectrum for
 * track and thumb.  All instances exist for the lifetime of the sim and do not require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import timer from '../../../../axon/js/timer.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import HSlider from '../../../../sun/js/HSlider.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import sliderClickSound from '../../../sounds/slider-clicks-idea-c-example_mp3.js';
import sliderBoundaryClickSound from '../../../sounds/slider-clicks-idea-c-lower-end-click_mp3.js';
import waveInterference from '../../waveInterference.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

// constants
const MIN_INTER_CLICK_TIME = ( 1 / 60 * 1000 ) * 2; // min time between clicks, in milliseconds, empirically determined

const maxString = waveInterferenceStrings.max;
const minString = waveInterferenceStrings.min;

const LABEL_OPTIONS = {
  fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
  maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
};
const MAJOR_TICK_MODULUS = 5;

class WaveInterferenceSlider extends HSlider {

  /**
   * @param {NumberProperty} property
   * @param {Object} [options]
   */
  constructor( property, options ) {

    const maxTickIndex = ( options && options.maxTickIndex ) ? options.maxTickIndex : 10;

    // Sound for the wave slider clicks
    const addSoundOptions = { categoryName: 'user-interface' };
    const soundClipOptions = { initialOutputLevel: 0.2 };

    // add sound generators that will play a sound when the value controlled by the slider changes
    const sliderClickSoundClip = new SoundClip( sliderClickSound, soundClipOptions );
    soundManager.addSoundGenerator( sliderClickSoundClip, addSoundOptions );

    const sliderBoundaryClickSoundClip = new SoundClip( sliderBoundaryClickSound, soundClipOptions );
    soundManager.addSoundGenerator( sliderBoundaryClickSoundClip, addSoundOptions );

    assert && assert( property.range, 'WaveInterferenceSlider.property requires range' );
    const min = property.range.min;
    const max = property.range.max;
    const minLabel = new WaveInterferenceText( min === 0 ? '0' : minString, LABEL_OPTIONS );
    const maxLabel = new WaveInterferenceText( maxString, LABEL_OPTIONS );
    const ticks = _.range( 0, maxTickIndex + 1 ).map( index => {
      return {
        value: Utils.linear( 0, maxTickIndex, min, max, index ),
        type: index % MAJOR_TICK_MODULUS === 0 ? 'major' : 'minor',
        label: index === 0 ? minLabel :
               index === maxTickIndex ? maxLabel :
               null
      };
    } );

    // Keep track of the previous value on slider drag for playing sounds
    let lastValue = property.value;

    // Keep track of the last time a sound was played so that we don't play too often
    let timeOfLastClick = 0;

    options = merge( {

      // Ticks are created for all sliders for sonification, but not shown for the Light Frequency slider
      showTicks: true,

      drag: event => {

        const value = property.value;

        if ( event.isFromPDOM() ) {

          // Generate a sound once per event from alternative input, but wait for the event to complete so we can know
          // the final property value

          timer.setTimeout( () => {

            // Also account for roundoff error, since 0.99999 seems like close enough to the end of the input.
            if ( Math.abs( value - property.value ) <= 1E-6 ) {
              sliderBoundaryClickSoundClip.play();
            }
            else {
              sliderClickSoundClip.play();
            }
          }, 0 );
        }
        else {

          // handle the sound as desired for mouse/touch style input
          for ( let i = 0; i < ticks.length; i++ ) {
            const tick = ticks[ i ];
            if ( lastValue !== value && ( value === property.range.min || value === property.range.max ) ) {
              sliderBoundaryClickSoundClip.play();
              break;
            }
            else if ( lastValue < tick.value && value >= tick.value || lastValue > tick.value && value <= tick.value ) {
              if ( phet.joist.elapsedTime - timeOfLastClick >= MIN_INTER_CLICK_TIME ) {
                sliderClickSoundClip.play();
                timeOfLastClick = phet.joist.elapsedTime;
              }
              break;
            }
          }
        }

        lastValue = value;
      }
    }, options );

    // ticks
    if ( options.showTicks ) {
      options = merge( {
        tickLabelSpacing: 2,
        majorTickLength: WaveInterferenceConstants.MAJOR_TICK_LENGTH,
        minorTickLength: 8

      }, options );
    }

    if ( !options.thumbNode ) {
      options.thumbSize = WaveInterferenceConstants.THUMB_SIZE;
    }

    if ( !options.trackNode ) {
      options.trackSize = new Dimension2( 150, 1 );
    }

    super( property, property.range, options );

    options.showTicks && ticks.forEach( tick => {
      if ( tick.type === 'major' ) {
        this.addMajorTick( tick.value, tick.label );
      }
      else {
        this.addMinorTick( tick.value, tick.label );
      }
    } );
  }
}

waveInterference.register( 'WaveInterferenceSlider', WaveInterferenceSlider );
export default WaveInterferenceSlider;