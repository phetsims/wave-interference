// Copyright 2018-2021, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders--but note that light frequency slider uses spectrum for
 * track and thumb.  All instances exist for the lifetime of the sim and do not require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import HSlider from '../../../../sun/js/HSlider.js';
import generalBoundaryBoopSoundPlayer from '../../../../tambo/js/shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import generalSoftClickSoundPlayer from '../../../../tambo/js/shared-sound-players/generalSoftClickSoundPlayer.js';
import waveInterference from '../../waveInterference.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

// constants
const MIN_INTER_CLICK_TIME = 33.3; // min time between clicking sounds, in milliseconds, empirically determined
const TOLERANCE = 1E-6;

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
      constrainValue: value => {
        if ( Math.abs( value - property.range.min ) <= TOLERANCE ) {
          return property.range.min;
        }
        else if ( Math.abs( value - property.range.max ) <= TOLERANCE ) {
          return property.range.max;
        }
        else {
          return value;
        }
      },

      drag: event => {

        const value = property.value;

        if ( event.isFromPDOM() ) {

          if ( Math.abs( value - property.range.max ) <= TOLERANCE ||
               Math.abs( value - property.range.min ) <= TOLERANCE ) {
            generalBoundaryBoopSoundPlayer.play();
          }
          else {
            generalSoftClickSoundPlayer.play();
          }
        }
        else {

          // handle the sound as desired for mouse/touch style input
          for ( let i = 0; i < ticks.length; i++ ) {
            const tick = ticks[ i ];
            if ( lastValue !== value && ( value === property.range.min || value === property.range.max ) ) {
              generalBoundaryBoopSoundPlayer.play();
              break;
            }
            else if ( lastValue < tick.value && value >= tick.value || lastValue > tick.value && value <= tick.value ) {
              if ( phet.joist.elapsedTime - timeOfLastClick >= MIN_INTER_CLICK_TIME ) {
                generalSoftClickSoundPlayer.play();
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