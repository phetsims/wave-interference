// Copyright 2017-2018, University of Colorado Boulder

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
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionModel {
    constructor() {

      // @public - whether the laser is emitting light
      this.onProperty = new BooleanProperty( true );

      // @public dimensions of the square aperture
      this.squareWidthProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
      this.squareHeightProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );

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

      // @public - selected scene
      this.sceneProperty = new Property( DiffractionModel.ApertureType.CIRCLE, {
        validValues: DiffractionModel.ApertureType.VALUES
      } );
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

  /**
   * An aperture can be circular (CIRCLE), rectangular (RECTANGLE), or an array of slits (SLITS).
   * @public
   */
  DiffractionModel.ApertureType = new Enumeration( [ 'CIRCLE', 'RECTANGLE', 'SLITS' ] );

  return waveInterference.register( 'DiffractionModel', DiffractionModel );
} );