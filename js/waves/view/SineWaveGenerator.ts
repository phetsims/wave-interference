// Copyright 2019-2021, University of Colorado Boulder
// @ts-nocheck
/**
 * Plays a sine wave using an Oscillator Node
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundConstants from '../../../../tambo/js/soundConstants.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';

// For the sound scene, map the amplitude to the output level for the "Play Tone"
const mapAmplitudeToOutputLevel = new LinearFunction(
  WaveInterferenceConstants.AMPLITUDE_RANGE.min,
  WaveInterferenceConstants.AMPLITUDE_RANGE.max,
  0,
  0.3 // Max output level
);

class SineWaveGenerator extends SoundGenerator {

  /**
   * @param frequencyProperty
   * @param amplitudeProperty
   * @param [options]
   */
  constructor( frequencyProperty, amplitudeProperty, options ) {
    options = merge( {
      initialOutputLevel: 0, // Starts silent, see elsewhere in this file for where the outputLevel is set as a function of amplitude
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
        this.oscillator.connect( this.soundSourceDestination );
        this.oscillator.start();
      }
      else if ( !fullyEnabled && this.oscillator !== null ) {

        // Turn off the audio, note that there is no need to disconnect the oscillator - this happens automatically
        this.oscillator.stop( this.audioContext.currentTime + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
        this.oscillator = null;
      }
    } );

    // wire up volume to amplitude
    amplitudeProperty.link( amplitude => this.setOutputLevel( mapAmplitudeToOutputLevel.evaluate( amplitude ) ) );
  }
}

waveInterference.register( 'SineWaveGenerator', SineWaveGenerator );
export default SineWaveGenerator;