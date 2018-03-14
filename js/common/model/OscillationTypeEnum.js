// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var OscillationTypeEnum = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  OscillationTypeEnum.VALUES = _.values( OscillationTypeEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( OscillationTypeEnum ); }

  waveInterference.register( 'OscillationTypeEnum', OscillationTypeEnum );

  return OscillationTypeEnum;
} );