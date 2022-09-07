// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Slider abstraction for the frequency and amplitude sliders--but note that light frequency slider uses spectrum for
 * track and thumb.  All instances exist for the lifetime of the sim and do not require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

// constants
const TOLERANCE = 1E-6;

const maxString = WaveInterferenceStrings.max;
const minString = WaveInterferenceStrings.min;

const LABEL_OPTIONS = {
  fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
  maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
};
const MAJOR_TICK_MODULUS = 5;

class WaveInterferenceSlider extends HSlider {

  public constructor( property: TProperty<number>, options?: HSliderOptions ) {

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

    options = merge( {

      // Match the number of sounds generated to the number of tickmarks.  The count is reduced by two to account for
      // the first and last ticks.
      valueChangeSoundGeneratorOptions: { numberOfMiddleThresholds: ticks.length - 2 },

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