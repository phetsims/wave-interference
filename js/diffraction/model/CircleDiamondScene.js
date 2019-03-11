// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a single rectangular aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class CircleDiamondScene extends DiffractionScene {

    constructor() {

      const circleDiameterProperty = new NumberProperty( 10, {
        range: new Range( 5, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 * 0.8 ) // TODO: magic number
      } );
      const squareDiameterProperty = new NumberProperty( 0, {
        range: new Range( 0, 0.99 )
      } );
      super( [ circleDiameterProperty, squareDiameterProperty ] );

      // @public {NumberProperty}
      this.circleDiameterProperty = circleDiameterProperty;

      // @public {NumberProperty}
      this.squareDiameterProperty = squareDiameterProperty;
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {
      assert && assert( matrix.getRowDimension() % 2 === 0, 'matrix should be even' );
      assert && assert( matrix.getColumnDimension() % 2 === 0, 'matrix should be even' );

      const y0 = matrix.getRowDimension() / 2;
      const x0 = matrix.getColumnDimension() / 2;
      const diameter = this.circleDiameterProperty.value;
      const eccentricity = this.squareDiameterProperty.value;

      const rx = diameter;
      const rx2 = rx * rx * scaleFactor;
      const ry2 = rx * rx * ( 1 - eccentricity * eccentricity ) * scaleFactor;

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {
          const dx = ( x - x0 );
          const dy = ( y - y0 );

          // Ellipse equation: (x-h)^2 /rx^2  + (y-k)^2/ry^2 <=1
          const ellipseValue = dx * dx / rx2 + dy * dy / ry2;

          matrix.set( y, x, ellipseValue < 1 ? 1 : 0 );
        }
      }
    }
  }

  /**
   * TODO: do we need this to smooth the edges?
   * @param {number} x0
   * @param {number} y0
   * @param {number} sigmaX
   * @param {number} sigmaY
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  CircleDiamondScene.gaussian = ( x0, y0, sigmaX, sigmaY, x, y ) => {
    const dx = x - x0;
    const dy = y - y0;
    const a = dx * dx / sigmaX / sigmaX;
    const b = dy * dy / sigmaY / sigmaY;
    return Math.pow( Math.E, -( a + b ) / 2 );
  };

  return waveInterference.register( 'CircleDiamondScene', CircleDiamondScene );
} );