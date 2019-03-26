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
  const Matrix3 = require( 'DOT/Matrix3' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class CircleDiamondScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.circleDiameterProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 0, 1000 )
      } );

      // @public {NumberProperty}
      this.diamondDiameterProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 0, 1000 )
      } );

      this.properties = [ this.circleDiameterProperty, this.diamondDiameterProperty ];
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

      // TODO: separate the objects based on scaleFactor?
      const delta = 0.1 * scaleFactor;

      const circleCenterX = Util.roundSymmetric( matrix.getColumnDimension() * ( 1 / 2 - delta ) );
      const circleCenterY = Util.roundSymmetric( matrix.getRowDimension() * ( 1 / 2 - delta ) );
      const circleRadius = this.circleDiameterProperty.value / 2 * scaleFactor * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      const diamondCenterX = Util.roundSymmetric( matrix.getColumnDimension() * ( 1 / 2 + delta ) );
      const diamondCenterY = Util.roundSymmetric( matrix.getRowDimension() * ( 1 / 2 + delta ) );
      const diamondRadius = this.diamondDiameterProperty.value / 2 * scaleFactor * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      const rectangle = Shape.rectangle( -diamondRadius, -diamondRadius, diamondRadius * 2, diamondRadius * 2 );
      const diamond = rectangle.transformed( Matrix3.rotation2( Math.PI / 4 ) )
        .transformed( Matrix3.translation( diamondCenterX, diamondCenterY ) );

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {
          const dxCircle = ( x - circleCenterX );
          const dyCircle = ( y - circleCenterY );
          const distanceToCenterCircle = Math.sqrt( dxCircle * dxCircle + dyCircle * dyCircle );
          const isInCircle = distanceToCenterCircle < circleRadius;

          const isInDiamond = diamond.containsPoint( new Vector2( x, y ) );

          matrix.set( y, x, isInCircle || isInDiamond ? 1 : 0 );
        }
      }
    }
  }

  return waveInterference.register( 'CircleDiamondScene', CircleDiamondScene );
} );