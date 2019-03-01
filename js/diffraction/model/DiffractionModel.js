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
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Matrix = require( 'DOT/Matrix' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RectangleScene = require( 'WAVE_INTERFERENCE/diffraction/model/RectangleScene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const MATRIX_DIMENSION = 256;
  const DIMS = [ MATRIX_DIMENSION, MATRIX_DIMENSION ];
  const CONTRAST_CONSTANT = 9e-3;

  class DiffractionModel {
    constructor() {

      // @public - whether the laser is emitting light
      this.onProperty = new BooleanProperty( true );

      this.rectangleScene = new RectangleScene();

      // @public dimensions of the elliptical aperture
      this.sigmaXProperty = new NumberProperty( 10, {
        range: new Range( 2, 10 )
      } );
      this.sigmaYProperty = new NumberProperty( 10, {
        range: new Range( 2, 10 )
      } );
      this.gaussianMagnitudeProperty = new NumberProperty( 400 );

      // @public characteristics of the grating
      this.numberOfLinesProperty = new NumberProperty( 10, {
        range: new Range( 2, 200 )
      } );
      this.angleProperty = new NumberProperty( 0, {
        range: new Range( 0, Math.PI * 2 )
      } );

      // @public - selected aperture type, which is in essence the "scene" for this screen.
      this.apertureTypeProperty = new Property( DiffractionModel.ApertureType.RECTANGLE, {
        validValues: DiffractionModel.ApertureType.VALUES
      } );

      this.sceneProperty = new Property( this.rectangleScene, {
        validValues: [ this.rectangleScene ]
      } );

      // The displayed aperture
      // var N = dims[1];
      // var M = dims[0];
      // for (var k = 0; k < N; k++) {
      //   for (var l = 0; l < M; l++) {
      //     var idx = k*M + l;
      // 2d array with stride defined by index = kM + l
      this.apertureMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      // Transformed aperture to account for wavelength changes
      this.scaledAperture = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      // Result of FFT on the scaledAperture
      this.diffractionMatrix = new Matrix( MATRIX_DIMENSION, MATRIX_DIMENSION );

      const update = () => {
        this.apertureMatrix.timesEquals( 0 ); // clear
        this.rectangleScene.paintMatrix( this.apertureMatrix );
        this.diffractionMatrix.timesEquals( 0 ); // TODO: unnecessary

        this.fft( this.apertureMatrix, this.diffractionMatrix );

      };
      this.rectangleScene.link( update );

      // TODO: one set of apertureMatrix/scaledApertureMatrix/transformedMatrix per scene?
      // TODO: or one total (shared)?  <--- leaning toward shared
    }

    /**
     * @param {Matrix} input
     * @param {Matrix} output
     */
    fft( input, output ) {
      // compute the h hat values
      const result = [];
      Fourier.transform( DiffractionModel.getPlainArray( input ), result );
      const shifted = Fourier.shift( result, DIMS );

      // get the largest magnitude
      const maxMagnitude = Math.max( ...shifted.map( h => h.magnitude() ) );

      // draw the pixels
      const logOfMaxMag = Math.log( CONTRAST_CONSTANT * maxMagnitude + 1 );

      for ( let i = 0; i < result.length; i++ ) {
        this.diffractionMatrix.entries[ i ] = Math.log( CONTRAST_CONSTANT * shifted[ i ].magnitude() + 1 ) / logOfMaxMag;
      }
    }

    /**
     * @public
     */
    reset() {
      this.onProperty.reset();
      this.rectangleScene.reset();
      this.sigmaXProperty.reset();
      this.sigmaYProperty.reset();
      this.gaussianMagnitudeProperty.reset();
      this.numberOfLinesProperty.reset();
      this.angleProperty.reset();
      this.apertureTypeProperty.reset();
    }
  }

  /**
   * An aperture can be circular (CIRCLE), rectangular (RECTANGLE), or an array of slits (SLITS).
   * @public
   */
  DiffractionModel.ApertureType = new Enumeration( [ 'CIRCLE', 'RECTANGLE', 'SLITS' ] );

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} sigmaX
   * @param {number} sigmaY
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  DiffractionModel.gaussian = ( x0, y0, sigmaX, sigmaY, x, y ) => {
    const dx = x - x0;
    const dy = y - y0;
    const a = dx * dx / sigmaX / sigmaX;
    const b = dy * dy / sigmaY / sigmaY;
    return Math.pow( Math.E, -( a + b ) / 2 );
  };

  DiffractionModel.getPlainArray = matrix => {
    const x = [];
    for ( let i = 0; i < matrix.size; i++ ) {
      x[ i ] = matrix.entries[ i ];
    }
    return x;
  };

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );