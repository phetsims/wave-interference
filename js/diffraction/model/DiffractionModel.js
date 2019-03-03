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
  const EllipseScene = require( 'WAVE_INTERFERENCE/diffraction/model/EllipseScene' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Matrix = require( 'DOT/Matrix' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RectangleScene = require( 'WAVE_INTERFERENCE/diffraction/model/RectangleScene' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const MATRIX_DIMENSION = 256;
  const MATRIX_DIMENSIONS = [ MATRIX_DIMENSION, MATRIX_DIMENSION ];
  const CONTRAST = 0.01;
  const DEFAULT_WAVELENGTH = ( VisibleColor.MIN_WAVELENGTH + VisibleColor.MAX_WAVELENGTH ) / 2;

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

      this.scenes = [ this.ellipseScene, this.rectangleScene ];

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
        this.apertureMatrix.timesEquals( 0 ); // clear

        const percentDifference = ( this.wavelengthProperty.value - DEFAULT_WAVELENGTH ) / DEFAULT_WAVELENGTH;

        // More frequency => more diffraction
        const scaleFactor = 1 - percentDifference * 2;
        this.sceneProperty.value.paintMatrix( this.apertureMatrix, 1 );
        this.sceneProperty.value.paintMatrix( this.scaledApertureMatrix, scaleFactor );
        DiffractionModel.fft( this.scaledApertureMatrix, this.diffractionMatrix );
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

  DiffractionModel.getPlainArray = matrix => {
    const x = [];
    for ( let i = 0; i < matrix.size; i++ ) {
      x[ i ] = matrix.entries[ i ];
    }
    return x;
  };

  /**
   * @param {Matrix} input
   * @param {Matrix} output
   */
  DiffractionModel.fft = ( input, output ) => {
    // compute the h hat values
    const result = [];
    Fourier.transform( DiffractionModel.getPlainArray( input ), result );
    const shifted = Fourier.shift( result, MATRIX_DIMENSIONS );

    // get the largest magnitude
    const maxMagnitude = Math.max( ...shifted.map( h => h.magnitude() ) );

    // draw the pixels
    const logOfMaxMag = Math.log( CONTRAST * maxMagnitude + 1 );

    for ( let i = 0; i < result.length; i++ ) {
      output.entries[ i ] = Math.log( CONTRAST * shifted[ i ].magnitude() + 1 ) / logOfMaxMag;
    }
  };

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );