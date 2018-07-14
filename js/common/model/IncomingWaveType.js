// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const IncomingWaveType = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  IncomingWaveType.VALUES = _.values( IncomingWaveType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( IncomingWaveType ); }

  waveInterference.register( 'IncomingWaveType', IncomingWaveType );

  return IncomingWaveType;
} );