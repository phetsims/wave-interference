// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ApertureType = require( 'WAVE_INTERFERENCE/diffraction/model/ApertureType' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionModel {
    constructor() {

      // @public {Property.<boolean>} whether the laser is emitting light
      this.onProperty = new BooleanProperty( true );

      // @public dimensions of the square aperture
      this.squareWidthProperty = new NumberProperty( 16 );
      this.squareHeightProperty = new NumberProperty( 16 );

      // @public dimensions of the elliptical aperture
      this.sigmaXProperty = new NumberProperty( 10 );
      this.sigmaYProperty = new NumberProperty( 10 );
      this.gaussianMagnitudeProperty = new NumberProperty( 400 );

      // @public characteristics of the grating
      this.numberOfLinesProperty = new NumberProperty( 10 );
      this.angleProperty = new NumberProperty( 0 );

      // @public {Property.<ApertureType>} selected scene
      this.sceneProperty = new Property( ApertureType.CIRCLE );
    }

    /**
     * @public
     */
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