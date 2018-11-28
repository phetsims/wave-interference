// Copyright 2018, University of Colorado Boulder

/**
 * Determines the selected aperture shape.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'ApertureType', new Enumeration( [ 'CIRCLE', 'RECTANGLE', 'SLITS' ] ) );
} );