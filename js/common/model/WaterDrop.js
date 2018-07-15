// Copyright 2018, University of Colorado Boulder

/**
 * The model for a water drop which falls to the water in the water scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const NumberProperty = require( 'AXON/NumberProperty' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaterDrop {
    constructor() {

      // @public
      this.heightProperty = new NumberProperty();
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );