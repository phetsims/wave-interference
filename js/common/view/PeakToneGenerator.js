// Copyright 2019, University of Colorado Boulder

/**
 * Plays a tone for each maximum on the WaveAreaGraphNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class PeakToneGenerator extends SoundClip {

    /**
     * @param {Property.<number>} property
     * @param {Object} sound - returned by the sound! plugin
     * @param {Property.<boolean>} resetInProgressProperty
     * @constructor
     */
    constructor( property, sound, resetInProgressProperty ) {

      super( sound, {
        loop: true,
        trimSilence: false
      } );

      this.property = property;

      // function for starting the sound or adjusting the volume
      const listener = value => {

        if ( !resetInProgressProperty.value ) {

          this.setPlaybackRate( value, 1E-2 );
          if ( !this.isPlaying ) {
            this.play();
          }
        }
      };
      property.lazyLink( listener );

      // @private {function}
      this.disposeContinuousPropertySoundGenerator = () => property.unlink( listener );
    }

    /**
     * @public
     */
    dispose() {
      this.disposeContinuousPropertySoundGenerator();
      super.dispose();
    }
  }

  waveInterference.register( 'PeakToneGenerator', PeakToneGenerator );

  return PeakToneGenerator;
} );