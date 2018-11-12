// Copyright 2018, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.  TODO: rename WaveTemporalType.js
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const IncomingWaveType = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  IncomingWaveType.VALUES = _.values( IncomingWaveType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( IncomingWaveType ); }

  return waveInterference.register( 'IncomingWaveType', IncomingWaveType );
} );