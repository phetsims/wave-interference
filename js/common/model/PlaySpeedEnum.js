// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the simulation is playing at normal speed or slow motion.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const PlaySpeedEnum = {

    // At the time of writing, this is a new strategy for enum patterns, partway between our normal enum
    // string pattern and the richer enum pattern exemplified in Orientation.js
    NORMAL: { scaleFactor: 1.0 },
    SLOW: { scaleFactor: 0.5 }
  };

  PlaySpeedEnum.VALUES = _.values( PlaySpeedEnum );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( PlaySpeedEnum ); }

  return waveInterference.register( 'PlaySpeedEnum', PlaySpeedEnum );
} );