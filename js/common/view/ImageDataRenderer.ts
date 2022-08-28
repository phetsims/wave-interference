// Copyright 2018-2020, University of Colorado Boulder

/**
 * Utility type for rendering to a canvas via putImageData.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';

class ImageDataRenderer {
  public readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly imageData: ImageData;
  public readonly data: Uint8ClampedArray;

  public constructor( width: number, height: number ) {

    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = width;
    this.canvas.height = height;

    this.context = this.canvas.getContext( '2d' )!;
    this.imageData = this.context.createImageData( width, height );

    // One-dimensional array containing the data in the RGBA order, with integer values
    // between 0 and 255 (inclusive).
    this.data = this.imageData.data;
  }

  /**
   * Paints image data onto the canvas.
   */
  public putImageData( x = 0, y = 0 ): void {
    this.context.putImageData( this.imageData, x, y );
  }
}

waveInterference.register( 'ImageDataRenderer', ImageDataRenderer );
export default ImageDataRenderer;