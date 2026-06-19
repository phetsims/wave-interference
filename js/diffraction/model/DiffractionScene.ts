// Copyright 2019-2026, University of Colorado Boulder

/**
 * Base type for Scenes in the diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Matrix from '../../../../dot/js/Matrix.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';

// The scene's tunable Properties are heterogeneous (number, boolean, etc.) and are only reset and bulk-linked here, so
// we describe them with the covariant read-only Property interface plus reset(), which any concrete Property satisfies.
type ResettableProperty = TReadOnlyProperty<unknown> & { reset(): void };

abstract class DiffractionScene {

  // tunable characteristics of this scene
  protected readonly properties: ResettableProperty[];

  // The diffraction pattern is computed as a 2D discrete fourier transform of the aperture pattern, which is
  // represented as a 2d floating point Matrix.  In order to efficiently compute the aperture pattern, we render the
  // shapes to a canvas in the model, then sample points from the canvas using canvas.context.getImageData(), see
  // paintMatrix().  We previously tried other approaches for populating the aperture Matrix (such as using kite
  // Shape.containsPoint), but they were too inefficient to be practical.
  private readonly canvas: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;

  public constructor( properties: ResettableProperty[] ) {

    this.properties = properties;

    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
    this.canvas.height = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;

    this.context = this.canvas.getContext( '2d' )!;

    affirm( this.renderToContext, 'Subclass must define renderToContext' );
  }

  /**
   * Add our pattern to the matrix.
   *
   * @param matrix
   * @param scaleFactor - zoom factor to account for frequency difference
   */
  public paintMatrix( matrix: Matrix, scaleFactor: number ): void {

    // clear canvas
    this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.context.save();
    const rowDimension = matrix.getRowDimension();
    const columnDimension = matrix.getColumnDimension();

    affirm( rowDimension % 2 === 0, 'matrix should be even' );
    affirm( columnDimension % 2 === 0, 'matrix should be even' );

    this.context.fillStyle = 'white';
    this.context.translate( this.canvas.width / 2, this.canvas.height / 2 );
    this.context.scale( scaleFactor, scaleFactor );
    this.context.translate( -this.canvas.width / 2, -this.canvas.height / 2 );

    // Each scene paints its aperture pattern to the canvas context.  This has good performance and unifies the code
    // Disable image smoothing for the data to ensure for all platforms compute the same, see https://github.com/phetsims/wave-interference/issues/405

    // Cast to access vendor-prefixed image smoothing properties that are not in the CanvasRenderingContext2D type.
    const context = this.context as CanvasRenderingContext2D & {
      mozImageSmoothingEnabled?: boolean;
      webkitImageSmoothingEnabled?: boolean;
      msImageSmoothingEnabled?: boolean;
    };
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
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
   */
  public abstract renderToContext( context: CanvasRenderingContext2D ): void;

  /**
   * Restore the initial values for all Property instances.
   */
  public reset(): void {
    this.properties.forEach( property => property.reset() );
  }

  /**
   * Link to each Property instance
   */
  public linkToAllProperties( listener: ( value: unknown ) => void ): void {
    this.properties.forEach( property => property.link( listener ) );
  }
}

export default DiffractionScene;
