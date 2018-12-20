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
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveSpatialType = require( 'WAVE_INTERFERENCE/common/model/WaveSpatialType' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );

  class SlitsModel extends WavesModel {

    constructor() {
      super( {

        initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max,
        waveSpatialType: WaveSpatialType.PLANE,

        // SoundParticles are not displayed on the Slits screen,
        // see https://github.com/phetsims/wave-interference/issues/109
        showSoundParticles: false
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

  return waveInterference.register( 'SlitsModel', SlitsModel );
} );