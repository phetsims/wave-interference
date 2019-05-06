// Copyright 2018-2019, University of Colorado Boulder

/**
 * Plays a sine wave using an Oscillator Node
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const soundConstants = require( 'TAMBO/soundConstants' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class SineWaveGenerator extends SoundGenerator {

    /**
     * @param {Property.<number>} frequencyProperty
     * @param {Property.<number>} amplitudeProperty
     * @param {Object} [options]
     */
    constructor( frequencyProperty, amplitudeProperty, options ) {
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
          updateFrequency();
          this.oscillator.connect( this.masterGainNode );
          this.oscillator.start();
        }
        else if ( !fullyEnabled && this.oscillator !== null ) {

          // The parent fades out, we schedule a stop to coincide with the end of the fade out time.
          this.oscillator.stop( this.audioContext.currentTime + soundConstants.LINEAR_GAIN_CHANGE_TIME );
          // oscillator.disconnect() happens automatically
          this.oscillator = null;
        }
      } );

      // Wire up volume to amplitude
      // TODO: Ashton
      amplitudeProperty.link( amplitude => {
        const amp = Util.linear( WaveInterferenceConstants.AMPLITUDE_RANGE.min, WaveInterferenceConstants.AMPLITUDE_RANGE.max,
          0, 0.4, amplitude );
        this.setOutputLevel( amp );
      } );
    }
  }

  return waveInterference.register( 'SineWaveGenerator', SineWaveGenerator );
} );
