// Copyright 2018-2019, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const WaveInterferenceQueryParameters = QueryStringMachine.getAll( {

    // Shows the overlays for the theoretical/ideal (far-field) interference patterns on the "Slits" screen. Starting in
    // 1.1+, this will be shared with teachers and should not be changed lightly.
    // See https://github.com/phetsims/wave-interference/issues/196
    theory: { type: 'flag' },

    latticeSize: { type: 'number', defaultValue: 151 },

    // TODO: eliminate this flag when we are ready for publication with sonification.
    fullSonification: { type: 'flag' },

    // TODO: eliminate this flag for publication
    diffractionScaleFactor: { type: 'number', defaultValue: 3 }
  } );

  waveInterference.register( 'WaveInterferenceQueryParameters', WaveInterferenceQueryParameters );

  return WaveInterferenceQueryParameters;
} );
