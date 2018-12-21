// Copyright 2018, University of Colorado Boulder

/**
 * Utility type for rendering to a canvas via putImageData.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class ImageDataRenderer {

    /**
     * @param {Lattice} lattice
     * @param {number} width
     */
    constructor( lattice, width ) {
      const height = lattice.height - lattice.dampY * 2;

      // @public {HTMLCanvasElement}
      this.canvas = document.createElement( 'canvas' );
      this.canvas.width = width;
      this.canvas.height = height;

      // @private
      this.context = this.canvas.getContext( '2d' );

      // @private
      this.imageData = this.context.createImageData( width, height );

      // @public {Uint8ClampedArray} - One-dimensional array containing the data in the RGBA order, with integer values
      // between 0 and 255 (inclusive).
      this.data = this.imageData.data;
    }

    /**
     * Paints image data onto the canvas.
     * @param {number} x
     * @param {number} y
     */
    putImageData( x = 0, y = 0 ) {
      this.context.putImageData( this.imageData, x, y );
    }
  }

  return waveInterference.register( 'ImageDataRenderer', ImageDataRenderer );
} );