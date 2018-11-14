// Copyright 2018, University of Colorado Boulder

/**
 * Enum that identifies the type of Scene
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'SceneType', new Enumeration( [ 'WATER', 'SOUND', 'LIGHT' ] ) );
} );