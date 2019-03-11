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
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class CircleDiamondScene extends DiffractionScene {

    constructor() {

      const circleDiameterProperty = new NumberProperty( 10, {
        range: new Range( 5, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 * 0.8 ) // TODO: magic number
      } );
      const diamondDiameterProperty = new NumberProperty( 10, {
        range: new Range( 5, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 * 0.8 )
      } );
      super( [ circleDiameterProperty, diamondDiameterProperty ] );

      // @public {NumberProperty}
      this.circleDiameterProperty = circleDiameterProperty;

      // @public {NumberProperty}
      this.diamondDiameterProperty = diamondDiameterProperty;
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

      const circleCenterX = Util.roundSymmetric( matrix.getColumnDimension() * 1 / 3 );
      const circleCenterY = Util.roundSymmetric( matrix.getRowDimension() * 1 / 3 );
      const circleRadius = this.circleDiameterProperty.value / 2;

      const diamondCenterX = Util.roundSymmetric( matrix.getColumnDimension() * 2 / 3 );
      const diamondCenterY = Util.roundSymmetric( matrix.getRowDimension() * 2 / 3 );
      const diamondRadius = this.diamondDiameterProperty.value / 2;

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {
          const dxCircle = ( x - circleCenterX );
          const dyCircle = ( y - circleCenterY );
          const distanceToCenterCircle = Math.sqrt( dxCircle * dxCircle + dyCircle * dyCircle );
          const isInCircle = distanceToCenterCircle < circleRadius;

          const dxDiamond = ( x - diamondCenterX );
          const dyDiamond = ( y - diamondCenterY );
          const distanceToCenterDiamond = Math.sqrt( dxDiamond * dxDiamond + dyDiamond * dyDiamond );
          const isInDiamond = distanceToCenterDiamond < diamondRadius;

          matrix.set( y, x, isInCircle || isInDiamond ? 1 : 0 );
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