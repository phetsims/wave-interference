// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.  TODO: rename WaveTemporalType.js
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const WaveTemporalType = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  WaveTemporalType.VALUES = _.values( WaveTemporalType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( WaveTemporalType ); }

  return waveInterference.register( 'WaveTemporalType', WaveTemporalType );
} );