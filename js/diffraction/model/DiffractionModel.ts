// Copyright 2017-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Model for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Matrix from '../../../../dot/js/Matrix.js';
import Range from '../../../../dot/js/Range.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import CircleSquareScene from './CircleSquareScene.js';
import DisorderScene from './DisorderScene.js';
import EllipseScene from './EllipseScene.js';
import RectangleScene from './RectangleScene.js';
import WavingGirlScene from './WavingGirlScene.js';
import TModel from '../../../../joist/js/TModel.js';

// constants
const CONTRAST = 0.01;
const MATRIX_DIMENSION = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;

// preallocated to avoid generating garbage
const SHIFTED_MAGNITUDES = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );
const IMAGINARY_PART = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );
const REAL_PART = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );

// initialization for 3rd party library
FFT.init( MATRIX_DIMENSION );

class DiffractionModel implements TModel {
  public constructor() {

    // @public - whether the laser is emitting light
    this.onProperty = new BooleanProperty( false );

    // @public - the wavelength of the laser in nm
    this.wavelengthProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
      range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH ),
      units: 'nm'
    } );

    // @public (read-only) - scenes
    this.ellipseScene = new EllipseScene();
    this.rectangleScene = new RectangleScene();
    this.circleSquareScene = new CircleSquareScene();
    this.disorderScene = new DisorderScene();
    this.wavingGirlScene = new WavingGirlScene();

    // @public (read-only) {DiffractionScene[]}
    this.scenes = [
      this.ellipseScene,
      this.rectangleScene,
      this.circleSquareScene,
      this.disorderScene,
      this.wavingGirlScene
    ];

    // @public - selected aperture type, which is in essence the "scene" for this screen.
    this.sceneProperty = new Property( this.ellipseScene, {
      validValues: this.scenes
    } );

    // @public - The displayed aperture, shared by all scenes
    this.apertureMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

    // @private - Transformed aperture to account for wavelength changes for the FFT, shared by all scenes
    this.scaledApertureMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

    // @public - Result of FFT on the scaledApertureMatrix, shared by all scenes
    this.diffractionMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

    /**
     * Update the aperture and FFT result when model characteristics change.
     */
    const update = () => {

      // To give the appearance of the proper diffraction, we scale the aperture size before the FFT
      const scaleFactor = WaveInterferenceConstants.DEFAULT_WAVELENGTH / this.wavelengthProperty.value;
      const scene = this.sceneProperty.value;

      // Compute the aperture that will be rendered
      scene.paintMatrix( this.apertureMatrix, 1 );

      // Compute the aperture that will be FFT'ed
      scene.paintMatrix( this.scaledApertureMatrix, scaleFactor );

      if ( this.onProperty.value ) {
        fftImageProcessingLabs( this.scaledApertureMatrix, this.diffractionMatrix );
      }
      else {
        this.diffractionMatrix.timesEquals( 0 );
      }
    };
    this.scenes.forEach( scene => scene.linkToAllProperties( update ) );
    this.sceneProperty.link( update );
    this.wavelengthProperty.link( update );
    this.onProperty.link( update );
  }

  /**
   * Restore initial conditions.
   */
  public reset(): void {
    this.scenes.forEach( scene => scene.reset() );
    this.onProperty.reset();
    this.sceneProperty.reset();
    this.wavelengthProperty.reset();
  }

  public step( dt: number ): void {

    // Model is static
  }
}

/**
 * Given row/column indices, find the index in the flattened array.  Uses the same strategy as DOT/Matrix.
 * @param i - row index
 * @param j - column index
 */
const getIndex = ( i: number, j: number ): number => {
  return i * MATRIX_DIMENSION + j;
};

/**
 * Computes the 2D discrete fourier transform of the aperture, which will be displayed as the diffraction pattern.
 * This method uses a 3rd party library for computing the FFT.  In postprocessing steps, it
 * (a) it swaps the quadrants to put the low frequencies in the center.
 * (b) shows the log of the magnitudes instead of the raw frequencies to have better fidelity
 * see https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/www/notes/fourier/fourier.pdf
 * @param input - aperture matrix
 * @param output - place to set fft result values
 */
const fftImageProcessingLabs = ( input, output ) => {

  // Take the values from the aperture
  for ( let i = 0; i < input.entries.length; i++ ) {
    REAL_PART[ i ] = input.entries[ i ];
    IMAGINARY_PART[ i ] = 0;
  }

  // FFT library performs in-place computation.  Result overwrites the input.
  FFT.fft2d( REAL_PART, IMAGINARY_PART );

  // From https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/www/notes/fourier/fourier.pdf
  // Practical issues: For display purposes, you probably want to cyclically translate the picture so that pixel (0,0)
  // which now contains frequency (ωx, ωy ) = (0, 0), moves to the center of the image. And you probably want to
  // display pixel values proportional to log(magnitude) of each complex number (this looks more interesting than just
  // magnitude). For color images, do the above to each of the three channels (R, G, and B) independently.
  for ( let row = 0; row < MATRIX_DIMENSION; row++ ) {
    for ( let col = 0; col < MATRIX_DIMENSION; col++ ) {
      const source = getIndex( row, col );
      const destination = getIndex(
        ( row + MATRIX_DIMENSION / 2 ) % MATRIX_DIMENSION,
        ( col + MATRIX_DIMENSION / 2 ) % MATRIX_DIMENSION
      );
      SHIFTED_MAGNITUDES[ destination ] = Math.sqrt( REAL_PART[ source ] * REAL_PART[ source ] + IMAGINARY_PART[ source ] * IMAGINARY_PART[ source ] );
    }
  }

  // Set values to the output Matrix
  const maxMagnitude = _.max( SHIFTED_MAGNITUDES );
  const logOfMaxMag = Math.log( CONTRAST * maxMagnitude + 1 );
  for ( let i = 0; i < SHIFTED_MAGNITUDES.length; i++ ) {
    output.entries[ i ] = Math.log( CONTRAST * SHIFTED_MAGNITUDES[ i ] + 1 ) / logOfMaxMag;
  }
};

waveInterference.register( 'DiffractionModel', DiffractionModel );
export default DiffractionModel;