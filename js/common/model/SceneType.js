// Copyright 2018, University of Colorado Boulder

//REVIEW this enum is redundant, use WaterScene, SoundScene, and LightScene constructors
//REVIEW* At the moment, this Enumeration simplifies some logic in `Scene.js` and loading subtype
//REVIEW* constructors would result in a requirejs loop.  Please advise.
/**
 * Enum that identifies the type of Scene
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'SceneType', new Enumeration( [ 'WATER', 'SOUND', 'LIGHT' ] ) );
} );