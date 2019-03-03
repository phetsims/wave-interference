// Copyright 2019, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => { // eslint-disable-line bad-sim-text
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const ImageDataRenderer = require( 'WAVE_INTERFERENCE/common/view/ImageDataRenderer' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // Linear scaling factor to increase the brightness
  const SCALE_FACTOR = 3;

  class MatrixCanvasNode extends CanvasNode {

    /**
     * @param {Matrix} matrix
     * @param {Object} [options]
     */
    constructor( matrix, options ) {

      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: new Bounds2( 0, 0, 256, 256 ), // TODO: factor out
        layerSplit: true, // ensure we're on our own layer
        baseColor: Color.white
      }, options );

      super( options );

      // @private -- note node already defines matrix
      this.dataMatrix = matrix;

      // @private
      this.baseColor = options.baseColor;

      // @private - For performance, render into a sub-canvas which will be drawn into the rendering context at the right
      // scale.
      // TODO: where is the scaling defined?  Do we need this smaller raster?  If so, why?
      this.imageDataRenderer = new ImageDataRenderer( matrix.getRowDimension(), matrix.getColumnDimension() );

      // Invalidate paint when model indicates changes
      // matrix.changedEmitter.addListener( this.invalidatePaint.bind( this ) );
    }

    /**
     * Sets the color of the peaks of the wave.
     * @param {Color} color
     * @public
     */
    setBaseColor( color ) {
      this.baseColor = color;
      this.invalidatePaint();
    }

    /**
     * Draws into the canvas.
     * @param {CanvasRenderingContext2D} context
     * @public
     * @override
     */
    paintCanvas( context ) {

      let x = 0;

      const m = this.dataMatrix.getRowDimension();
      const n = this.dataMatrix.getColumnDimension();
      for ( let row = 0; row < m; row++ ) {
        for ( let column = 0; column < n; column++ ) {

          // Note this is transposed because of the ordering of putImageData
          // TODO: re-transpose because of ordering of putImageData?
          const value = this.dataMatrix.get( row, column ); // TODO: inline stride for performance?

          // Note this interpolation doesn't include the gamma factor that Color.blend does
          const r = Math.min( value * this.baseColor.red * SCALE_FACTOR, 255 );
          const g = Math.min( value * this.baseColor.green * SCALE_FACTOR, 255 );
          const b = Math.min( value * this.baseColor.blue * SCALE_FACTOR, 255 );

          // ImageData.data is Uint8ClampedArray.  Use Math.round instead of Util.roundSymmetric
          // because performance is critical and all numbers are non-negative.
          const offset = 4 * x;
          this.imageDataRenderer.data[ offset ] = Math.round( r );
          this.imageDataRenderer.data[ offset + 1 ] = Math.round( g );
          this.imageDataRenderer.data[ offset + 2 ] = Math.round( b );
          this.imageDataRenderer.data[ offset + 3 ] = 255; // Fully opaque
          x++;
        }
      }
      this.imageDataRenderer.putImageData();

      // draw the sub-canvas to the rendering context at the appropriate scale
      context.save();
      context.drawImage( this.imageDataRenderer.canvas, 0, 0 );
      context.restore();
    }
  }

  return waveInterference.register( 'MatrixCanvasNode', MatrixCanvasNode );
} );