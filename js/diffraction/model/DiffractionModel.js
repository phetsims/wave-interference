// Copyright 2017, University of Colorado Boulder

/**
 * The Diffraction model is implemented in DiffractionScreenView
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionModel {
    constructor() {}

    reset() {}
  }

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );