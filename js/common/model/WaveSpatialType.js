// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the wave is a point source or plane wave.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const WaveSpatialType = {
    POINT: 'POINT',
    PLANE: 'PLANE'
  };

  WaveSpatialType.VALUES = _.values( WaveSpatialType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( WaveSpatialType ); }

  return waveInterference.register( 'WaveSpatialType', WaveSpatialType );
} );