// Copyright 2018, University of Colorado Boulder

/**
 * Displays a non-interactive water drop image that falls from the hose nozzle and splashes into the lattice.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const waterDropImage = require( 'image!WAVE_INTERFERENCE/water_drop.png' );

  class WaterDropNode extends Image {

    /**
     * @param {WaterDrop} waterDrop
     */
    constructor( waterDrop ) {
      super( waterDropImage, {
        scale: 0.3,
        centerX: 200
      } );
      var bottom = 100;
      waterDrop.distanceAboveWaterProperty.link( distanceAboveWater => this.setBottom( bottom - distanceAboveWater ) );

      // @public (read-only) for identity checking at removal time
      this.waterDrop = waterDrop;
    }
  }

  return waveInterference.register( 'WaterDropNode', WaterDropNode );
} );