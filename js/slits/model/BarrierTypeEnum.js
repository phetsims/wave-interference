// Copyright 2018, University of Colorado Boulder

/**
 * Determines the barrier type (if any).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'BarrierTypeEnum', new Enumeration( [ 'NO_BARRIER', 'ONE_SLIT', 'TWO_SLITS' ] ) );
} );