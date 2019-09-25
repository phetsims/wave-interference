// Copyright 2019, University of Colorado Boulder

/**
 * Plays a sine wave using an Oscillator Node
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const LinearFunction = require( 'DOT/LinearFunction' );
  const soundConstants = require( 'TAMBO/soundConstants' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const MAX_OUTPUT_LEVEL = 0.4; // valid range is from 0 to 1

  // function to map amplitude to output level
  // TODO: Ashton - set output level to mix well with other sounds
  const mapAmplitudeToOutputLevel = new LinearFunction(
    WaveInterferenceConstants.AMPLITUDE_RANGE.min,
    WaveInterferenceConstants.AMPLITUDE_RANGE.max,
    0,
    MAX_OUTPUT_LEVEL
  );

  class SineWaveGenerator extends SoundGenerator {

    /**
     * @param {Property.<number>} frequencyProperty
     * @param {Property.<number>} amplitudeProperty
     * @param {Object} [options]
     */
    constructor( frequencyProperty, amplitudeProperty, options ) {
      options = _.extend( {
        initialOutputLevel: 0,
        oscillatorType: 'sine'
      }, options );
      super( options );

      // @private {OscillatorNode|null} created when sound begins and nullified when sound ends, see #373
      this.oscillator = null;
      const updateFrequency = () => {
        const value = frequencyProperty.value * 1000; // convert frequency in mHz to Hz
        this.oscillator && this.oscillator.frequency.setValueAtTime( value, this.audioContext.currentTime );
      };
      frequencyProperty.link( updateFrequency );

      this.fullyEnabledProperty.link( fullyEnabled => {
        if ( fullyEnabled && this.oscillator === null ) {
          this.oscillator = this.audioContext.createOscillator();
          this.oscillator.type = options.oscillatorType;
          updateFrequency();
          this.oscillator.connect( this.masterGainNode );
          this.oscillator.start();
        }
        else if ( !fullyEnabled && this.oscillator !== null ) {

          // The parent fades out, we schedule a stop to coincide with the end of the fade out time.
          this.oscillator.stop( this.audioContext.currentTime + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
          this.oscillator = null;
          // note that there is no need to disconnect the oscillator - this happens automatically
        }
      } );

      // wire up volume to amplitude
      amplitudeProperty.link( amplitude => {
        this.setOutputLevel( mapAmplitudeToOutputLevel( amplitude ) );
      } );
    }
  }

  return waveInterference.register( 'SineWaveGenerator', SineWaveGenerator );
} );
