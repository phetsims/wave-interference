// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the simulation is playing at normal speed or slow motion.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'PlaySpeedEnum', new Enumeration( [ 'NORMAL', 'SLOW' ] ) );
} );