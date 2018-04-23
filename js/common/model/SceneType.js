// Copyright 2016, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var SceneType = {
    WATER: 'WATER',
    SOUND: 'SOUND',
    LIGHT: 'LIGHT'
  };

  SceneType.VALUES = _.values( SceneType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( SceneType ); }

  waveInterference.register( 'SceneType', SceneType );

  return SceneType;
} );