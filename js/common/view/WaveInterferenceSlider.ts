// Copyright 2018-2026, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders--but note that light frequency slider uses spectrum for
 * track and thumb.  All instances exist for the lifetime of the sim and do not require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import type NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { linear } from '../../../../dot/js/util/linear.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HSlider, { type HSliderOptions } from '../../../../sun/js/HSlider.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

// constants
const TOLERANCE = 1E-6;

const LABEL_OPTIONS = {
  fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
  maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
};
const MAJOR_TICK_MODULUS = 5;

type SelfOptions = {

  // Whether tick marks are shown; they are shown for all sliders except the Light Frequency slider.
  showTicks?: boolean;

  // The index of the highest tick; the number of ticks is maxTickIndex + 1.
  maxTickIndex?: number;
};

type ParentOptions = HSliderOptions;
export type WaveInterferenceSliderOptions = SelfOptions & ParentOptions;

class WaveInterferenceSlider extends HSlider {

  public constructor( property: NumberProperty, providedOptions?: WaveInterferenceSliderOptions ) {

    // Number of ticks is maxTickIndex + 1; read here since it is needed before optionize to build the ticks.
    const maxTickIndex = providedOptions?.maxTickIndex ?? 10;

    const range = property.range;
    affirm( range, 'WaveInterferenceSlider.property requires range' );
    const min = range.min;
    const max = range.max;
    const minLabel = new WaveInterferenceText( min === 0 ? '0' : WaveInterferenceStrings.minStringProperty, LABEL_OPTIONS );
    const maxLabel = new WaveInterferenceText( WaveInterferenceStrings.maxStringProperty, LABEL_OPTIONS );
    const ticks = _.range( 0, maxTickIndex + 1 ).map( index => {
      return {
        value: linear( 0, maxTickIndex, min, max, index ),
        type: index % MAJOR_TICK_MODULUS === 0 ? 'major' : 'minor',
        label: index === 0 ? minLabel :
               index === maxTickIndex ? maxLabel :
               null
      };
    } );

    const options = optionize<WaveInterferenceSliderOptions, SelfOptions, ParentOptions>()( {

      // Ticks are shown for all sliders except the Light Frequency slider.
      showTicks: true,
      maxTickIndex: 10,
      constrainValue: ( value: number ) => {
        if ( Math.abs( value - range.min ) <= TOLERANCE ) {
          return range.min;
        }
        else if ( Math.abs( value - range.max ) <= TOLERANCE ) {
          return range.max;
        }
        else {
          return value;
        }
      }
    }, providedOptions );

    // ticks
    if ( options.showTicks ) {
      options.tickLabelSpacing = options.tickLabelSpacing === undefined ? 2 : options.tickLabelSpacing;
      options.majorTickLength = options.majorTickLength === undefined ? WaveInterferenceConstants.MAJOR_TICK_LENGTH : options.majorTickLength;
      options.minorTickLength = options.minorTickLength === undefined ? 8 : options.minorTickLength;

      // Align the inter-value slider sounds with the visible tick marks, while keeping the default min/max boundary
      // sounds.  The count is reduced by two to exclude the first and last ticks, which use the boundary sounds.
      options.valueChangeSoundGeneratorOptions = options.valueChangeSoundGeneratorOptions ?? { numberOfMiddleThresholds: ticks.length - 2 };
    }

    if ( !options.thumbNode ) {
      options.thumbSize = WaveInterferenceConstants.THUMB_SIZE;
    }

    if ( !options.trackNode ) {
      options.trackSize = new Dimension2( 150, 1 );
    }

    super( property, range, options );

    options.showTicks && ticks.forEach( tick => {
      if ( tick.type === 'major' ) {
        this.addMajorTick( tick.value, tick.label ?? undefined );
      }
      else {
        this.addMinorTick( tick.value, tick.label ?? undefined );
      }
    } );
  }
}

export default WaveInterferenceSlider;
