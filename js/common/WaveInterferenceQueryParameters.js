// Copyright 2018, University of Colorado Boulder

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

    // shows the overlays for the theoretical/ideal (far-field) interference patterns on the "Slits" screen.
    theory: { type: 'flag' }
  } );

  waveInterference.register( 'WaveInterferenceQueryParameters', WaveInterferenceQueryParameters );

  return WaveInterferenceQueryParameters;
} );
