// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'WaveTemporalType', new Enumeration( [ 'PULSE', 'CONTINUOUS' ] ) );
} );