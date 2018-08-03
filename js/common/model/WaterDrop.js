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

  // constants
  var SPEED = 80;

  class WaterDrop {
    constructor() {

      // @public {Property.<number>} - the distance above the pool
      this.distanceAboveWaterProperty = new NumberProperty( 10 );
    }

    /**
     * Move the water forward in time.
     * @param {number} dt - elapsed time in the units of the scene
     */
    step( dt ) {
      this.distanceAboveWaterProperty.value = this.distanceAboveWaterProperty.value - SPEED * dt;
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );