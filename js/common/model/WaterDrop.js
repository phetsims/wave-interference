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

      // @public
      this.distanceAboveWaterProperty = new NumberProperty( 10 );
    }

    step( dt ) {
      this.distanceAboveWaterProperty.value = this.distanceAboveWaterProperty.value - SPEED * dt;
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );