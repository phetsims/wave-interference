// Copyright 2018-2022, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../waveInterference.js';

const WaveInterferenceQueryParameters = QueryStringMachine.getAll( {

  // Shows the overlays for the theoretical/ideal (far-field) interference patterns on the "Slits" screen. Starting in
  // 1.1+, this will be shared with teachers and should not be changed lightly.
  // See https://github.com/phetsims/wave-interference/issues/196
  theory: { type: 'flag', public: true },

  latticeSize: { type: 'number', defaultValue: 151 }
} );

waveInterference.register( 'WaveInterferenceQueryParameters', WaveInterferenceQueryParameters );

export default WaveInterferenceQueryParameters;