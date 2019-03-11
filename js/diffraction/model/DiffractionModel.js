// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CircleDiamondScene = require( 'WAVE_INTERFERENCE/diffraction/model/CircleDiamondScene' );
  const EllipseScene = require( 'WAVE_INTERFERENCE/diffraction/model/EllipseScene' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Matrix = require( 'DOT/Matrix' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RectangleScene = require( 'WAVE_INTERFERENCE/diffraction/model/RectangleScene' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const CONTRAST = 0.01;
  const DEFAULT_WAVELENGTH = ( VisibleColor.MIN_WAVELENGTH + VisibleColor.MAX_WAVELENGTH ) / 2;
  const MATRIX_DIMENSION = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;

  // preallocated to avoid generating garbage
  const SHIFTED_MAGNITUDES = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );
  const im = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );
  const re = new Array( MATRIX_DIMENSION * MATRIX_DIMENSION );

  // initialization for 3rd party library
  FFT.init( MATRIX_DIMENSION );

  class DiffractionModel {
    constructor() {

      // @public - whether the laser is emitting light
      this.onProperty = new BooleanProperty( true );

      // @public - the wavelength of the laser in nm
      this.wavelengthProperty = new NumberProperty( DEFAULT_WAVELENGTH, {
        range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH )
      } );

      // @public
      this.ellipseScene = new EllipseScene();

      // @public
      this.rectangleScene = new RectangleScene();

      // @public
      this.circleDiamondScene = new CircleDiamondScene();

      // @public characteristics of the grating
      this.numberOfLinesProperty = new NumberProperty( 10, {
        range: new Range( 2, 200 )
      } );
      this.angleProperty = new NumberProperty( 0, {
        range: new Range( 0, Math.PI * 2 )
      } );

      this.sceneProperty = new Property( DiffractionModel.ApertureType.RECTANGLE, {
        validValues: DiffractionModel.ApertureType.VALUES
      } );

      this.scenes = [ this.ellipseScene, this.rectangleScene, this.circleDiamondScene ];

      // @public - selected aperture type, which is in essence the "scene" for this screen.
      this.sceneProperty = new Property( this.ellipseScene, {
        validValues: this.scenes
      } );

      // The displayed aperture, shared by all scenes
      this.apertureMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      // Transformed aperture to account for wavelength changes for the FFT, shared by all scenes
      this.scaledApertureMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      // Result of FFT on the scaledApertureMatrix, shared by all scenes
      this.diffractionMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      const update = () => {

        // clear before drawing
        this.apertureMatrix.timesEquals( 0 );
        this.scaledApertureMatrix.timesEquals( 0 );

        const scaleDifference = ( this.wavelengthProperty.value - DEFAULT_WAVELENGTH ) / DEFAULT_WAVELENGTH;

        // More frequency => more diffraction
        const scaleFactor = 1 - scaleDifference * 2;
        const scene = this.sceneProperty.value;
        scene.paintMatrix( this.apertureMatrix, 1 );
        scene.paintMatrix( this.scaledApertureMatrix, scaleFactor );
        DiffractionModel.fftImageProcessingLabs( this.scaledApertureMatrix, this.diffractionMatrix );
      };
      this.scenes.forEach( scene => scene.link( update ) );
      this.sceneProperty.link( update );
      this.wavelengthProperty.link( update );
    }

    /**
     * @public
     */
    reset() {
      this.scenes.forEach( scene => scene.reset() );
      this.onProperty.reset();
      this.numberOfLinesProperty.reset();
      this.angleProperty.reset();
      this.sceneProperty.reset();
    }
  }

  /**
   * An aperture can be circular (CIRCLE), rectangular (RECTANGLE), or an array of slits (SLITS).
   * @public
   */
  DiffractionModel.ApertureType = new Enumeration( [ 'CIRCLE', 'RECTANGLE', 'SLITS' ] );

  /**
   * Given row/column indices, find the index in the flattened array.  Uses the same strategy as DOT/Matrix.
   * @param {number} i - row index
   * @param {number} j - column index
   * @returns {number} - array index
   */
  const getIndex = ( i, j ) => {
    return i * MATRIX_DIMENSION + j;
  };

  /**
   * @param {Matrix} input
   * @param {Matrix} output - to set resultant values to
   */
  DiffractionModel.fftImageProcessingLabs = ( input, output ) => {

    for ( let i = 0; i < input.entries.length; i++ ) {
      re[ i ] = input.entries[ i ];
      im[ i ] = 0;
    }

    FFT.fft2d( re, im );

    // From https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/www/notes/fourier/fourier.pdf
    // Practical issues: For display purposes, you probably want to cyclically translate the picture so that pixel (0,0), which now contains frequency (ωx, ωy ) = (0, 0), moves to the center
    // of the image. And you probably want to display pixel values proportional to log(magnitude)
    // of each complex number (this looks more interesting than just magnitude). For color images, do the above to each of the three channels (R, G, and B) independently.

    for ( let row = 0; row < MATRIX_DIMENSION; row++ ) {
      for ( let col = 0; col < MATRIX_DIMENSION; col++ ) {
        const source = getIndex( row, col );
        const destination = getIndex(
          ( row + MATRIX_DIMENSION / 2 ) % MATRIX_DIMENSION,
          ( col + MATRIX_DIMENSION / 2 ) % MATRIX_DIMENSION
        );
        SHIFTED_MAGNITUDES[ destination ] = Math.sqrt( re[ source ] * re[ source + im[ source ] * im[ source ] ] );
      }
    }

    // get the largest magnitude
    let maxMagnitude = 0;
    for ( let i = 0; i < SHIFTED_MAGNITUDES.length; i++ ) {
      if ( SHIFTED_MAGNITUDES[ i ] > maxMagnitude ) {
        maxMagnitude = SHIFTED_MAGNITUDES[ i ];
      }
    }

    // draw the pixels
    const logOfMaxMag = Math.log( CONTRAST * maxMagnitude + 1 );

    for ( let i = 0; i < SHIFTED_MAGNITUDES.length; i++ ) {
      output.entries[ i ] = Math.log( CONTRAST * SHIFTED_MAGNITUDES[ i ] + 1 ) / logOfMaxMag;
    }
  };

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );