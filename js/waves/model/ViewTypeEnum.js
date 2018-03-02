// Copyright 2016, University of Colorado Boulder

/**
 * Selects whether the wave is shown from the top (default) or side view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var ViewTypeEnum = {
    TOP: 'TOP',
    SIDE: 'SIDE'
  };

  ViewTypeEnum.VALUES = _.values( ViewTypeEnum );

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( ViewTypeEnum ); }

  waveInterference.register( 'ViewTypeEnum', ViewTypeEnum );

  return ViewTypeEnum;
} );