// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var IncomingWaveTypeEnum = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  IncomingWaveTypeEnum.VALUES = _.values( IncomingWaveTypeEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( IncomingWaveTypeEnum ); }

  waveInterference.register( 'IncomingWaveTypeEnum', IncomingWaveTypeEnum );

  return IncomingWaveTypeEnum;
} );