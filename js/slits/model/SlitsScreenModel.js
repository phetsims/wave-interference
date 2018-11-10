// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  class SlitsScreenModel extends WavesScreenModel {

    constructor() {
      super( {
        initialAmplitude: 10,

        // SoundParticles are not displayed on the Slits screen, see https://github.com/phetsims/wave-interference/issues/109
        showSoundParticles: false,

        // TODO: docs
        oscillatorType: 'plane'
      } );
    }

    /**
     * There are no water drops in this scene, and hence the slider controls the frequency directly.
     * @override
     * @public
     */
    getWaterFrequencySliderProperty() {
      return this.waterScene.frequencyProperty;
    }
  }

  return waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );
} );