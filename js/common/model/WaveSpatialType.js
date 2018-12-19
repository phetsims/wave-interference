// Copyright 2018, University of Colorado Boulder

//REVIEW^ A nit about doc for most (all?) enums. You say "Determines whether..." but an enum determines nothing, it is a
// set of values with no responsibilities. A {Property.<WaveSpatialType>} would "determine".
/**
 * Determines whether the wave is a point source or plane wave.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'WaveSpatialType', new Enumeration( [ 'POINT', 'PLANE' ] ) );
} );