// Copyright 2018-2019, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders--but note that light frequency slider uses spectrum for
 * track and thumb.  All instances exist for the lifetime of the sim and do not require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const Utils = require( 'DOT/Utils' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // sounds
  const sliderDecreaseClickSound = require( 'sound!TAMBO/slider-click-02.mp3' );
  const sliderIncreaseClickSound = require( 'sound!TAMBO/slider-click-01.mp3' );

  // strings
  const maxString = require( 'string!WAVE_INTERFERENCE/max' );
  const minString = require( 'string!WAVE_INTERFERENCE/min' );

  // constants
  const LABEL_OPTIONS = {
    fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
    maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
  };
  const MAX_TICK_INDEX = 10;
  const MAJOR_TICK_MODULUS = 5;

  class WaveInterferenceSlider extends HSlider {

    /**
     * @param {NumberProperty} property
     */
    constructor( property ) {

      // add sound generators that will play a sound when the value controlled by the slider changes
      const sliderIncreaseClickSoundClip = new SoundClip( sliderIncreaseClickSound );
      soundManager.addSoundGenerator( sliderIncreaseClickSoundClip );
      const sliderDecreaseClickSoundClip = new SoundClip( sliderDecreaseClickSound );
      soundManager.addSoundGenerator( sliderDecreaseClickSoundClip );

      assert && assert( property.range, 'WaveInterferenceSlider.property requires range' );
      const min = property.range.min;
      const max = property.range.max;
      const minLabel = new WaveInterferenceText( min === 0 ? '0' : minString, LABEL_OPTIONS );
      const maxLabel = new WaveInterferenceText( maxString, LABEL_OPTIONS );
      const ticks = _.range( 0, MAX_TICK_INDEX + 1 ).map( index => {
        return {
          value: Utils.linear( 0, MAX_TICK_INDEX, min, max, index ),
          type: index % MAJOR_TICK_MODULUS === 0 ? 'major' : 'minor',
          label: index === 0 ? minLabel :
                 index === MAX_TICK_INDEX ? maxLabel :
                 null
        };
      } );

      // Keep track of the previous value on slider drag for playing sounds
      let lastValue = property.value;

      super( property, property.range, {
        thumbSize: WaveInterferenceConstants.THUMB_SIZE,
        trackSize: new Dimension2( 150, 1 ),

        // ticks
        tickLabelSpacing: 2,
        majorTickLength: WaveInterferenceConstants.MAJOR_TICK_LENGTH,
        minorTickLength: 8,

        drag: event => {
          const value = property.value;

          for ( let i = 0; i < ticks.length; i++ ) {
            const tick = ticks[ i ];
            if ( lastValue < tick.value && value >= tick.value ) {
              sliderIncreaseClickSoundClip.play();
              break;
            }
            else if ( lastValue > tick.value && value <= tick.value ) {
              sliderDecreaseClickSoundClip.play();
              break;
            }
          }

          lastValue = value;
        }
      } );

      ticks.forEach( tick => {
        if ( tick.type === 'major' ) {
          this.addMajorTick( tick.value, tick.label );
        }
        else {
          this.addMinorTick( tick.value, tick.label );
        }
      } );
    }
  }

  return waveInterference.register( 'WaveInterferenceSlider', WaveInterferenceSlider );
} );