// Copyright 2018, University of Colorado Boulder

/**
 * The wave area can contain a barrier with ONE_SLIT, TWO_SLITS or NO_BARRIER at all.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'BarrierTypeEnum', new Enumeration( [ 'NO_BARRIER', 'ONE_SLIT', 'TWO_SLITS' ] ) );
} );