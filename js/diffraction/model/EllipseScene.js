// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a single rectangular aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class EllipseScene extends DiffractionScene {

    constructor() {

      const diameterProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
      const eccentricityProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
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
     * @public
     */
    paintMatrix( matrix ) {

      // TODO: n will always be even as power of 2, so is this OK?
      const centerRow = Util.roundSymmetric( matrix.getRowDimension() / 2 );
      const centerColumn = Util.roundSymmetric( matrix.getColumnDimension() / 2 );
      const diameter = this.diameterProperty.value;
      const eccentricity = this.eccentricityProperty.value;
      for ( let column = centerColumn - diameter; column <= centerColumn + diameter; column++ ) {
        for ( let row = centerRow - eccentricity; row <= centerRow + eccentricity; row++ ) {
          matrix.set( row, column, 1 );
        }
      }
    }
  }

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} sigmaX
   * @param {number} sigmaY
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  EllipseScene.gaussian = ( x0, y0, sigmaX, sigmaY, x, y ) => {
    const dx = x - x0;
    const dy = y - y0;
    const a = dx * dx / sigmaX / sigmaX;
    const b = dy * dy / sigmaY / sigmaY;
    return Math.pow( Math.E, -( a + b ) / 2 );
  };

  return waveInterference.register( 'EllipseScene', EllipseScene );
} );