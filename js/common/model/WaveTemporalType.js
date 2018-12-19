// Copyright 2018, University of Colorado Boulder

//REVIEW^ a better name for this might be DisturbanceType.  A wave is a continuous disturbance. A pulse is a one-time
//REVIEW^ disturbance.
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

  return waveInterference.register( 'WaveTemporalType', new Enumeration( [ 'PULSE', 'CONTINUOUS' ] ) );
} );