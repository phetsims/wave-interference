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

  class RectangleScene extends DiffractionScene {

    constructor() {

      const columnRadiusProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
      const rowRadiusProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
      super( [ columnRadiusProperty, rowRadiusProperty ] );

      // @public {NumberProperty}
      this.columnRadiusProperty = columnRadiusProperty;

      // @public {NumberProperty}
      this.rowRadiusProperty = rowRadiusProperty;
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
      const columnRadius = this.columnRadiusProperty.value;
      const rowRadius = this.rowRadiusProperty.value;
      for ( let column = centerColumn - columnRadius; column <= centerColumn + columnRadius; column++ ) {
        for ( let row = centerRow - rowRadius; row <= centerRow + rowRadius; row++ ) {
          matrix.set( row, column, 1 );
        }
      }
    }
  }

  return waveInterference.register( 'RectangleScene', RectangleScene );
} );