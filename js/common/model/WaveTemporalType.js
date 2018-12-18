// Copyright 2018, University of Colorado Boulder

//REVIEW a better name for this might be DisturbanceType.  A wave is a continuous disturbance. A pulse is a one-time disturbance.
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