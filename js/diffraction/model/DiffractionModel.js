// Copyright 2017-2018, University of Colorado Boulder

/**
 * The Diffraction model is implemented in DiffractionScreenView
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionModel {
    constructor() {

      // @public {Property.<boolean>} whether the laser is emitting light
      this.onProperty = new Property( true );

      // @public {Property.<number>} dimensions of the square aperture
      this.squareWidthProperty = new Property( 16 );
      this.squareHeightProperty = new Property( 16 );

      // @public {Property.<number>} dimensions of the elliptical aperture
      this.sigmaXProperty = new Property( 10 );
      this.sigmaYProperty = new Property( 10 );
      this.gaussianMagnitudeProperty = new Property( 400 );

      // @public {Property.<number>} characteristics of the grating
      this.numberOfLinesProperty = new Property( 10 );
      this.angleProperty = new Property( 0 );

      // @public {Property.<string>} selected scene
      this.sceneProperty = new Property( 'circle' ); // TODO: enum
    }

    reset() {
      this.onProperty.reset();
      this.squareWidthProperty.reset();
      this.squareHeightProperty.reset();
      this.sigmaXProperty.reset();
      this.sigmaYProperty.reset();
      this.gaussianMagnitudeProperty.reset();
      this.numberOfLinesProperty.reset();
      this.angleProperty.reset();
      this.sceneProperty.reset();
    }
  }

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );