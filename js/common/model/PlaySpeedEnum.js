// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the simulation is playing at normal speed or slow motion.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var PlaySpeedEnum = {

    // At the time of writing, this is a new strategy for enum patterns, partway between our normal enum
    // string pattern and the richer enum pattern exemplified in Orientation.js
    NORMAL: { scaleFactor: 1 },
    SLOW: { scaleFactor: 1 / 3 }
  };

  PlaySpeedEnum.VALUES = _.values( PlaySpeedEnum );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( PlaySpeedEnum ); }

  waveInterference.register( 'PlaySpeedEnum', PlaySpeedEnum );

  return PlaySpeedEnum;
} );