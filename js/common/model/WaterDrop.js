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
  const SPEED = 100;
  const INITIAL_HEIGHT = 200;

  class WaterDrop {
    constructor() {

      // @public {Property.<number>} - the distance above the pool in view coordinates

      this.distanceAboveWaterProperty = new NumberProperty( INITIAL_HEIGHT );
    }

    /**
     * Move the water forward in time.
     * @param {number} dt - elapsed time in the units of the scene
     */
    step( dt ) {
      this.distanceAboveWaterProperty.value = this.distanceAboveWaterProperty.value - SPEED * dt;
    }

    /**
     * Determine how long it takes on drop of water to fall.
     * @returns {number}
     */
    static get TIME_TO_FALL() {
      return INITIAL_HEIGHT / SPEED;
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );