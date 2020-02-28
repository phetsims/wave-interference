// Copyright 2018-2020, University of Colorado Boulder

/**
 * Utility type for rendering to a canvas via putImageData.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';

class ImageDataRenderer {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor( width, height ) {

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

waveInterference.register( 'ImageDataRenderer', ImageDataRenderer );
export default ImageDataRenderer;