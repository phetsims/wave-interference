// Copyright 2017, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function DiffractionModel() {
  }

  waveInterference.register( 'DiffractionModel', DiffractionModel );

  return inherit( Object, DiffractionModel );
} );