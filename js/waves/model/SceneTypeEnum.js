// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the input wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var SceneTypeEnum = {
    WATER: 'WATER',
    SOUND: 'SOUND',
    LIGHT: 'LIGHT'
  };

  SceneTypeEnum.VALUES = _.values( SceneTypeEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( SceneTypeEnum ); }

  waveInterference.register( 'SceneTypeEnum', SceneTypeEnum );

  return SceneTypeEnum;
} );