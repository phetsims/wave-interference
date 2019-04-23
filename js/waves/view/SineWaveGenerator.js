// Copyright 2018-2019, University of Colorado Boulder

/**
 * Plays a sine wave using an Oscillator Node
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class SineWaveGenerator extends SoundGenerator {
    constructor( frequencyProperty, amplitudeProperty, options ) {
      // TODO: the sound sounds buggy if I put {connectImmediately: true}
      super( options );

      this.oscillator = this.audioContext.createOscillator();
      frequencyProperty.link( frequency => {
        const value = frequency * 1000; // convert frequency in mHz to Hz
        this.oscillator.frequency.setValueAtTime( value, this.audioContext.currentTime );
      } );

      // TODO: Even if all enableControlProperties are initially false, there is a sound when this.oscillator.start()
      // is called.  This works around that problem
      let started = false;
      this.fullyEnabledProperty.link( fullyEnabled => {
        if ( !started && fullyEnabled ) {
          this.oscillator.start();
          started = true;
        }
      } );

      // Wire up volume to amplitude
      amplitudeProperty.link( amplitude => {
        const amp = Util.linear( WaveInterferenceConstants.AMPLITUDE_RANGE.min, WaveInterferenceConstants.AMPLITUDE_RANGE.max,
          0, 1, amplitude );
        this.setOutputLevel( amp );
      } );

      // Output through the master after all properties are set
      this.oscillator.connect( this.masterGainNode );
    }
  }

  return waveInterference.register( 'SineWaveGenerator', SineWaveGenerator );
} );
