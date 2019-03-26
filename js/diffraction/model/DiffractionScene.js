// Copyright 2019, University of Colorado Boulder

/**
 * Base type for Scenes in the diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class DiffractionScene {

    constructor() {

      // @public (read-only) {Property.<*>[]} - set by subclasses
      this.properties = null;

      // Render to a canvas and sample points.  Using kite Shape.containsPoint on the SVG shape declaration was much too slow
      this.canvas = document.createElement( 'canvas' );
      this.canvas.width = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
      this.canvas.height = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
      this.context = this.canvas.getContext( '2d' );
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {
      // TODO: use this strategy for all scenes, to improve performance and uniformity
      // clear canvas
      this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );

      // TODO:
      this.context.save();
      const rowDimension = matrix.getRowDimension();
      const columnDimension = matrix.getColumnDimension();

      assert && assert( rowDimension % 2 === 0, 'matrix should be even' );
      assert && assert( columnDimension % 2 === 0, 'matrix should be even' );

      // TODO: Should scale factor be appled to the canvas transform?
      this.context.fillStyle = 'white';
      this.renderToContext( scaleFactor );

      const canvasData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );
      const canvasDataWidth = canvasData.width;

      for ( let x = 0; x <= columnDimension; x++ ) {
        for ( let y = 0; y <= rowDimension; y++ ) {
          const pixelIndex = y * canvasDataWidth + x;
          const arrayIndex = pixelIndex * 4;
          const a = canvasData.data[ arrayIndex + 3 ]; // R=0, G=1, B=2, A=3
          matrix.set( y, x, a / 255 );
        }

      }
      this.context.restore();
    }

    /**
     * Restore the initial values for all Property instances.
     * @public
     */
    reset() {
      this.properties.forEach( property => property.reset() );
    }

    /**
     * Link to each Property instance
     * @param {function} listener
     */
    link( listener ) {
      this.properties.forEach( property => property.link( listener ) );
    }
  }

  return waveInterference.register( 'DiffractionScene', DiffractionScene );
} );