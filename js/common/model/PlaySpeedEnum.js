// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the input wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var PlaySpeedEnum = {

    // At the time of writing, this is a new strategy for enum patterns, kind of partway between our normal enum
    // string pattern and the richer enum pattern exemplified in Orientation.js
    NORMAL: { scaleFactor: 1 },
    SLOW: { scaleFactor: 1 / 3 }
  };

  PlaySpeedEnum.VALUES = _.values( PlaySpeedEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PlaySpeedEnum ); }

  waveInterference.register( 'PlaySpeedEnum', PlaySpeedEnum );

  return PlaySpeedEnum;
} );