// Copyright 2017, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function DiffractionModel() {
  }

  waveInterference.register( 'DiffractionModel', DiffractionModel );

  return inherit( Object, DiffractionModel, {
    reset: function() {}
  } );
} );