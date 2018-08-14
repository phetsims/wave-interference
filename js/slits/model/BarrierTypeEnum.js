// Copyright 2018, University of Colorado Boulder

/**
 * Determines the barrier type (if any).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const BarrierTypeEnum = {
    NO_BARRIER: 'NO_BARRIER',
    ONE_SLIT: 'ONE_SLIT',
    TWO_SLITS: 'TWO_SLITS'
  };

  BarrierTypeEnum.VALUES = _.values( BarrierTypeEnum );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( BarrierTypeEnum ); }

  return waveInterference.register( 'BarrierTypeEnum', BarrierTypeEnum );
} );