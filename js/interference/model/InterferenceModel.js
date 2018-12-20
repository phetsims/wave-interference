// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );

  class InterferenceModel extends WavesModel {
    constructor() {
      super( {
        numberOfSources: 2,
        initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max
      } );
    }
  }

  return waveInterference.register( 'InterferenceModel', InterferenceModel );
} );