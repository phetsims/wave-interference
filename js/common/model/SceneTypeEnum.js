// Copyright 2018, University of Colorado Boulder

/**
 * Scenes can be WATER, SOUND or LIGHT.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'SceneTypeEnum', new Enumeration( [ 'WATER', 'SOUND', 'LIGHT' ] ) );
} );