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

  class EllipseScene extends DiffractionScene {
    constructor() {

      // TODO: This value looks matched to the default wavelength
      const diameterProperty = new NumberProperty( 550, {
        range: new Range( 400, 8000 )
      } );
      const eccentricityProperty = new NumberProperty( 0, {
        range: new Range( 0, 0.99 )
      } );
      super( [ diameterProperty, eccentricityProperty ] );

      // @public {NumberProperty}
      this.diameterProperty = diameterProperty;

      // @public {NumberProperty}
      this.eccentricityProperty = eccentricityProperty;
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
      const diameter = this.diameterProperty.value;
      const eccentricity = this.eccentricityProperty.value;

      const rx = diameter / 2 * scaleFactor *
                 WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION /
                 WaveInterferenceConstants.DIFFRACTION_APERTURE_WIDTH;
      const rx2 = rx * rx;
      const ry2 = rx * rx * ( 1 - eccentricity * eccentricity );

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {
          const dx = ( x - x0 );
          const dy = ( y - y0 );

          // Ellipse equation: (x-h)^2 /rx^2  + (y-k)^2/ry^2 <=1
          const ellipseValue = dx * dx / rx2 + dy * dy / ry2;

          matrix.set( y, x, ellipseValue < 1 ? 1 : 0 );

          // TODO: Should we blur with something like
          // matrix.set( y, x, ellipseValue < 1 ? 1 - ellipseValue * ellipseValue * ellipseValue : 0 );
        }
      }
    }
  }

  return waveInterference.register( 'EllipseScene', EllipseScene );
} );