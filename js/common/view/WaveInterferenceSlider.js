// Copyright 2018, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const maxString = require( 'string!WAVE_INTERFERENCE/max' );
  const minString = require( 'string!WAVE_INTERFERENCE/min' );

  // constants
  const LABEL_OPTIONS = { fontSize: 10 };
  const MAX_TICK_INDEX = 10;
  const MAJOR_TICK_MODULUS = 5;

  class WaveInterferenceSlider extends HSlider {

    /**
     * @param {Property} property
     * @param {number} min
     * @param {number} max
     */
    constructor( property, min, max ) {
      const minLabel = new WaveInterferenceText( min === 0 ? '0' : minString, LABEL_OPTIONS );
      const maxLabel = new WaveInterferenceText( maxString, LABEL_OPTIONS );
      const ticks = _.range( 0, MAX_TICK_INDEX + 1 ).map( index => {
        return {
          value: Util.linear( 0, MAX_TICK_INDEX, min, max, index ),
          type: index % MAJOR_TICK_MODULUS === 0 ? 'major' : 'minor',
          label: index === 0 ? minLabel :
                 index === MAX_TICK_INDEX ? maxLabel :
                 null
        };
      } );

      super( property, new Range( min, max ), {
        thumbSize: WaveInterferenceConstants.THUMB_SIZE,
        trackSize: new Dimension2( 150, 1 ),

        // ticks
        tickLabelSpacing: 2,
        majorTickLength: 12, // TODO: share this with WaveInterferenceConstants
        minorTickLength: 8
      } );

      for ( let tick of ticks ) {
        if ( tick.type === 'major' ) {
          this.addMajorTick( tick.value, tick.label );
        }
        else {
          this.addMinorTick( tick.value, tick.label );
        }
      }
    }
  }

  return waveInterference.register( 'WaveInterferenceSlider', WaveInterferenceSlider );
} );