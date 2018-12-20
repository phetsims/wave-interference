// Copyright 2018, University of Colorado Boulder

/**
 * A wave can be ongoing (CONTINUOUS) or a single wavelength (PULSE)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'DisturbanceTypeEnum', new Enumeration( [ 'PULSE', 'CONTINUOUS' ] ) );
} );