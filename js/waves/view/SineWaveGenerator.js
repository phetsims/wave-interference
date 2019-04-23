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
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SineWaveGenerator extends SoundGenerator {
    constructor( frequencyProperty, options ) {
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

      // Output through the master after all properties are set
      this.oscillator.connect( this.masterGainNode );
    }
  }

  return waveInterference.register( 'SineWaveGenerator', SineWaveGenerator );
} );
