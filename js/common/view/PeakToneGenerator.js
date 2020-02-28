// Copyright 2019-2020, University of Colorado Boulder

/**
 * Plays a tone for each maximum on the WaveAreaGraphNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import waveInterference from '../../waveInterference.js';

class PeakToneGenerator extends SoundClip {

  /**
   * @param {Property.<number>} property
   * @param {Object} sound - returned by the sound! plugin
   * @param {Property.<boolean>} resetInProgressProperty
   * @constructor
   */
  constructor( property, sound, resetInProgressProperty ) {

    const lowPassFilter = phetAudioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.setValueAtTime( 200, 0 );
    lowPassFilter.Q.setValueAtTime( 10, 0 );

    super( sound, {
      loop: true,
      trimSilence: false,
      additionalNodes: [ lowPassFilter ]
    } );

    this.filter = lowPassFilter;

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

export default PeakToneGenerator;