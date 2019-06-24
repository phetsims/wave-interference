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

      // @protected {Property.<*>[]} - set by subclasses after construction
      // TODO: to the reviewer, is this pattern for specifying this.properties acceptable?  If not, can you please
      // TODO: recommend a better pattern?
      this.properties = null;

      // Render to a canvas and sample points.  Using kite Shape.containsPoint on the SVG shape declaration was much too slow
      // @private
      this.canvas = document.createElement( 'canvas' );
      this.canvas.width = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
      this.canvas.height = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;

      // @private
      this.context = this.canvas.getContext( '2d' );

      assert && assert( this.renderToContext, 'Subclass must define renderToContext' );
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {

      // clear canvas
      this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
      this.context.save();
      const rowDimension = matrix.getRowDimension();
      const columnDimension = matrix.getColumnDimension();

      assert && assert( rowDimension % 2 === 0, 'matrix should be even' );
      assert && assert( columnDimension % 2 === 0, 'matrix should be even' );

      this.context.fillStyle = 'white';
      this.context.translate( this.canvas.width / 2, this.canvas.height / 2 );
      this.context.scale( scaleFactor, scaleFactor );
      this.context.translate( -this.canvas.width / 2, -this.canvas.height / 2 );

      // Each scene paints its aperture pattern to the canvas context.  This has good performance and unifies the code
      // Disable image smoothing for the data to ensure for all platforms compute the same, see https://github.com/phetsims/wave-interference/issues/405
      this.context.mozImageSmoothingEnabled = false;
      this.context.webkitImageSmoothingEnabled = false;
      this.context.msImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
      this.renderToContext( this.context );

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
     * Render the aperture shape(s) to the canvas context.
     * @param {CanvasRenderingContext2D} context
     * @protected
     * @abstract
     */
    renderToContext( context ) {
      assert && assert( false, 'should be overridden in subclasses' );
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
     * @public
     */
    link( listener ) {
      this.properties.forEach( property => property.link( listener ) );
    }
  }

  return waveInterference.register( 'DiffractionScene', DiffractionScene );
} );