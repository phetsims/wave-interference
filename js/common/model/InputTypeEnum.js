// Copyright 2016, University of Colorado Boulder

/**
 * Determines whether the incoming wave is continuous or pulse.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var InputTypeEnum = {
    PULSE: 'PULSE',
    CONTINUOUS: 'CONTINUOUS'
  };

  InputTypeEnum.VALUES = _.values( InputTypeEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( InputTypeEnum ); }

  waveInterference.register( 'InputTypeEnum', InputTypeEnum );

  return InputTypeEnum;
} );