// Copyright 2019, University of Colorado Boulder

/**
 * Renders data from a Matrix into a canvas.  Shows the apertures and diffraction regions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const ImageDataRenderer = require( 'WAVE_INTERFERENCE/common/view/ImageDataRenderer' );
  const merge = require( 'PHET_CORE/merge' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // Linear scaling factor to increase the brightness.  Color values are clamped, and could whiten at the center.
  const SCALE_FACTOR = 2.5;

  class MatrixCanvasNode extends CanvasNode {

    /**
     * @param {Matrix} matrix
     * @param {Object} [options]
     */
    constructor( matrix, options ) {

      options = merge( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: new Bounds2( 0, 0,
          WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION,
          WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION
        ),
        layerSplit: true, // ensure we're on our own layer
        baseColor: Color.white
      }, options );

      super( options );

      // @private -- note node already defines matrix, so we use a different variable name
      this.dataMatrix = matrix;

      // @private
      this.baseColor = options.baseColor;

      // @private - Use putImageData for performance
      this.imageDataRenderer = new ImageDataRenderer( matrix.getRowDimension(), matrix.getColumnDimension() );
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

          // Get the value from the data matrix
          const value = this.dataMatrix.get( row, column );

          // Note this interpolation doesn't include the gamma factor that Color.blend does
          const r = Math.min( value * this.baseColor.red * SCALE_FACTOR, 255 );
          const g = Math.min( value * this.baseColor.green * SCALE_FACTOR, 255 );
          const b = Math.min( value * this.baseColor.blue * SCALE_FACTOR, 255 );

          // ImageData.data is Uint8ClampedArray.  Performance is critical and all numbers are non-negative.
          const offset = 4 * x;
          this.imageDataRenderer.data[ offset ] = Math.round( r ); // eslint-disable-line bad-sim-text
          this.imageDataRenderer.data[ offset + 1 ] = Math.round( g ); // eslint-disable-line bad-sim-text
          this.imageDataRenderer.data[ offset + 2 ] = Math.round( b ); // eslint-disable-line bad-sim-text
          this.imageDataRenderer.data[ offset + 3 ] = 255; // Fully opaque
          x++;
        }
      }
      this.imageDataRenderer.putImageData();

      // draw the sub-canvas to the rendering context at the appropriate scale
      context.drawImage( this.imageDataRenderer.canvas, 0, 0 );
    }
  }

  return waveInterference.register( 'MatrixCanvasNode', MatrixCanvasNode );
} );