// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the wave is a point source or plane wave.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'WaveSpatialType', new Enumeration( [ 'POINT', 'PLANE' ] ) );
} );