// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class RectangleScene extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      super();

// @public dimensions of the square aperture
      // TODO: always even, it is a radius
      this.columnRadiusProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
      this.rowRadiusProperty = new NumberProperty( 16, {
        range: new Range( 2, 30 )
      } );
    }

    // TODO: provide array of Property instead?
    link( listener ) {
      this.columnRadiusProperty.link( listener );
      this.rowRadiusProperty.link( listener );
    }

    reset() {
      this.columnRadiusProperty.reset();
      this.rowRadiusProperty.reset();
    }

    /**
     *
     * @param {Matrix} matrix
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