// Copyright 2018, University of Colorado Boulder

/**
 * Enum that identifies the type of Scene
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const SceneType = {
    WATER: 'WATER',
    SOUND: 'SOUND',
    LIGHT: 'LIGHT'
  };

  SceneType.VALUES = _.values( SceneType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( SceneType ); }

  return waveInterference.register( 'SceneType', SceneType );
} );