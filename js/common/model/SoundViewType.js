// Copyright 2018, University of Colorado Boulder

/**
 * For the SoundScene, WAVES, PARTICLES, or BOTH can be displayed.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'SoundViewType', new Enumeration( [ 'WAVES', 'PARTICLES', 'BOTH' ] ) );
} );