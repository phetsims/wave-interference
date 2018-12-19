// Copyright 2018, University of Colorado Boulder

/**
 * The simulation can run at normal speed (NORMAL) or slow motion (SLOW).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'PlaySpeedEnum', new Enumeration( [ 'NORMAL', 'SLOW' ] ) );
} );