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
  const Complex = require( 'DOT/Complex' );
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
        // TODO: clear in the paint methods
        this.apertureMatrix.timesEquals( 0 ); // clear
        this.scaledApertureMatrix.timesEquals( 0 ); // clear

        const scaleDifference = ( this.wavelengthProperty.value - DEFAULT_WAVELENGTH ) / DEFAULT_WAVELENGTH;

        // More frequency => more diffraction
        const scaleFactor = 1 - scaleDifference * 2;
        const scene = this.sceneProperty.value;
        scene.paintMatrix( this.apertureMatrix, 1 );
        scene.paintMatrix( this.scaledApertureMatrix, scaleFactor );
        // DiffractionModel.fftKiss( this.scaledApertureMatrix, this.diffractionMatrix );
        // this.diffractionMatrix.entries = this.diffractionMatrix.transpose().entries;
        // DiffractionModel.fftTurbomaze( this.scaledApertureMatrix, this.diffractionMatrix );
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

  DiffractionModel.getPlainArray = matrix => {
    const x = [];
    for ( let i = 0; i < matrix.size; i++ ) {
      x[ i ] = matrix.entries[ i ];
    }
    return x;
  };

  DiffractionModel.getFloat32Array = matrix => {
    const x = new Float32Array( matrix.getColumnDimension() * matrix.getRowDimension() );
    for ( let i = 0; i < matrix.size; i++ ) {
      x[ i ] = matrix.entries[ i ];
    }
    return x;
  };

  /**
   * @param {Matrix} input
   * @param {Matrix} output
   */
  DiffractionModel.fftTurbomaze = ( input, output ) => {
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

  /**
   * @param {Matrix} input
   * @param {Matrix} output
   */
  DiffractionModel.fftKiss = ( input, output ) => {

    const spectrum = rfft2d( DiffractionModel.getFloat32Array( input ), input.getRowDimension(), input.getColumnDimension() );
    let result = [];
    for ( let i = 0; i < spectrum.length; i += 2 ) {
      result.push( new Complex( spectrum[ i ], spectrum[ i + 1 ] ) );
    }
    debugger;

    // var m = new Matrix(input.getRowDimension(), input.getColumnDimension(),null,result);
    // m=m.transpose();
    // result = m.entries;

    const shifted = Fourier.shift( result, MATRIX_DIMENSIONS );
    // const shifted = result;

    // get the largest magnitude
    const maxMagnitude = Math.max( ...shifted.map( h => h.magnitude ) );

    // draw the pixels
    const logOfMaxMag = Math.log( CONTRAST * maxMagnitude + 1 );

    for ( let i = 0; i < shifted.length; i++ ) {
      output.entries[ i ] = Math.log( CONTRAST * shifted[ i ].magnitude + 1 ) / logOfMaxMag;
    }

    // var m = new Matrix( input.getRowDimension(), input.getColumnDimension(), null, output.entries );
    // var nz = m.transpose();
    //
    // output.entries = nz.entries;

    return;

    const spectrumCanvas = document.getElementById( 'spectrum' );
    const ctx = spectrumCanvas.getContext( '2d' );

    let maxval = 0;
    let minval = 999999999;
    const n = spectrumCanvas.height * ( spectrumCanvas.width / 2 + 1 );
    for ( let i = 0; i < 2 * n; i += 2 ) {
      spectrum[ i ] = Math.log( spectrum[ i ] * spectrum[ i ] + spectrum[ i + 1 ] * spectrum[ i + 1 ] );
      assert && assert( !isNaN( spectrum[ i ] ) );
      maxval = Math.max( maxval, spectrum[ i ] );
      minval = Math.min( minval, spectrum[ i ] );
    }

    const imgData = ctx.getImageData( 0, 0, spectrumCanvas.width, spectrumCanvas.height );
    let y = 0;
    let x = 0;
    for ( let i = 0; i <= 2 * n; i += 2 ) {
      const val = ( spectrum[ i ] - minval ) * 255 / maxval;
      // output.entries[ i ] = val / 255 / Math.E;
      assert && assert( !isNaN( val ), 'val' );
      // console.log( val );

      const j = y * spectrumCanvas.width + x;
      const k = ( y + 1 ) * spectrumCanvas.width - ( x + 1 );

      output.entries[ j * 4 / 2 ] = val / 255 / Math.E;
      output.entries[ k * 4 / 2 ] = val / 255 / Math.E;

      for ( let l = 0; l < 4; l++ ) {

        imgData.data[ j * 4 + l ] = l < 3 ? val : 255;
        imgData.data[ k * 4 + l ] = l < 3 ? val : 255;
      }

      x++;
      if ( x === spectrumCanvas.width / 2 + 1 ) {
        x = 0;
        y++;
      }
    }
    ctx.putImageData( imgData, 0, 0 );
  };

  DiffractionModel.fftImageProcessingLabs = ( input, output ) => {
    FFT.init( input.getRowDimension() );
    const im = new Array( input.entries.length );
    const re = new Array( input.entries.length );
    for ( let i = 0; i < input.entries.length; i++ ) {
      re[ i ] = input.entries[ i ];
      im[ i ] = 0;
    }
    FFT.fft2d( re, im );

    // FrequencyFilter.swap( re, im );

    const result = [];
    for ( let i = 0; i < re.length; i++ ) {
      result[ i ] = new Complex( re[ i ], im[ i ] );
    }

    // Rearrange quadrants
    const shifted = Fourier.shift( result, MATRIX_DIMENSIONS );

    // get the largest magnitude
    const maxMagnitude = Math.max( ...shifted.map( h => h.magnitude ) );

    // draw the pixels
    const logOfMaxMag = Math.log( CONTRAST * maxMagnitude + 1 );

    for ( let i = 0; i < shifted.length; i++ ) {
      output.entries[ i ] = Math.log( CONTRAST * shifted[ i ].magnitude + 1 ) / logOfMaxMag;
    }
  };

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );