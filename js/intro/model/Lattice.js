// Copyright 2017, University of Colorado Boulder

/**
 * The lattice is a 2D grid with a value in each cell that represents the wave amplitude at that point.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix = require( 'DOT/Matrix' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var waveSpeed = 0.5; // The wave speed in the coordinate frame of the lattice, see http://www.mtnmath.com/whatth/node47.html
  var waveSpeedSquared = waveSpeed * waveSpeed;
  var numMatrices = 3; // The algorithm we use for the discretized wave equation requires current value + 2 history points

  /**
   * @param {number} width - width of the lattice
   * @param {number} height - height of the lattice
   * @param {number} dampX - number of cells on the left and again on the right to use for damping
   * @param {number} dampY - number of cells on the top and again on the bottom to use for damping
   * @param {function} getPotential - function(i,j) that returns true if there is a potential barrier there
   * @constructor
   */
  function Lattice( width, height, dampX, dampY, getPotential ) {

    // @public (read-only) {number} number of cells on the left and again on the right to use for damping
    this.dampX = dampX;

    // @public (read-only) {number} number of cells on the top and again on the bottom to use for damping
    this.dampY = dampY;

    // @private {Matrix[]} matrices for current value, previous value and value before previous
    this.matrices = [];
    for ( var i = 0; i < numMatrices; i++ ) {
      this.matrices.push( new Matrix( width, height ) );
    }

    // @private {number} indicates the current matrix. Previous matrix is one higher (with correct modulus)
    this.currentMatrixIndex = 0;

    // @private {function} returns true if there is a potential barrier there TODO: move to options
    this.getPotential = getPotential || function( i, j ) {return false;};

    // @public {Emitter} sends a notification each time the lattice updates
    this.changedEmitter = new Emitter();

    // @public {number} (read-only) width of the lattice
    this.width = width;

    // @public {number} (read-only) height of the lattice
    this.height = height;
  }

  waveInterference.register( 'Lattice', Lattice );

  return inherit( Object, Lattice, {

    /**
     * Returns the current value in the given cell
     * @param {number} i
     * @param {number} j
     * @public
     */
    getCurrentValue: function( i, j ) {
      return this.matrices[ this.currentMatrixIndex ].get( i, j );
    },

    /**
     * Sets the current value in the given cell
     * @param {number} i
     * @param {number} j
     * @param {number} value
     * @public
     */
    setCurrentValue: function( i, j, value ) {
      this.matrices[ this.currentMatrixIndex ].set( i, j, value );
    },

    /**
     * Returns the previous value in the given cell
     * @param {number} i
     * @param {number} j
     * @private
     */
    getLastValue: function( i, j ) {
      return this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ].get( i, j );
    },

    /**
     * Sets the previous value in the given cell
     * @param {number} i
     * @param {number} j
     * @param {number} value
     * @private
     */
    setLastValue: function( i, j, value ) {
      this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ].set( i, j, value );
    },

    /**
     * Across a horizontal line, dampen the waveform based on past adjacent values.  Developed in the Java version as
     * one step in preventing artifacts near the edge of the visible part of the lattice.
     * @param {number} j - y coordinate for the lattice
     * @param {number} dj - distance above or below to look
     * @param {Matrix} matrix0 - current matrix
     * @param {Matrix} matrix2 - two time steps ago
     * @private
     */
    dampHorizontalTemporal: function( j, dj, matrix0, matrix2 ) {
      for ( var i = 0; i < this.width; i++ ) {
        matrix0.set( i, j, matrix2.get( i, j + dj ) );
      }
    },

    /**
     * Across a vertical line, dampen the waveform based on past adjacent values.  Developed in the Java version as
     * one step in preventing artifacts near the edge of the visible part of the lattice.
     * @param {number} i - x coordinate for the lattice
     * @param {number} di - distance left or right to look
     * @param {Matrix} matrix0 - current matrix
     * @param {Matrix} matrix2 - two time steps ago
     * @private
     */
    dampVerticalTemporal: function( i, di, matrix0, matrix2 ) {
      for ( var j = 0; j < this.height; j++ ) {
        matrix0.set( i, j, matrix2.get( i + di, j ) );
      }
    },

    /**
     * Exponential decay in a vertical band to prevent reflections or artifacts from the sides of the lattice.
     * @param {number} i0 - x coordinate of the damping region
     * @param {number} sign - +1 or -1 depending on which way the damping moves
     * @param {number} width - width of the damping region
     * @private
     */
    decayVertical: function( i0, sign, width ) {
      for ( var j = 0; j < this.height; j++ ) {
        for ( var step = 0; step < width; step++ ) {
          var distFromDampBoundary = width - step;
          var damp = this.getDamp( distFromDampBoundary );
          var i = i0 + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    },

    /**
     * Exponential decay in a horizontal band to prevent reflections or artifacts from the sides of the lattice.
     * @param {number} j0 - y coordinate of the damping region
     * @param {number} sign - +1 or -1 depending on which way the damping moves
     * @param {number} height - height of the damping region
     * @private
     */
    decayHorizontal: function( j0, sign, height ) {
      for ( var i = 0; i < this.width; i++ ) {
        for ( var step = 0; step < height; step++ ) {
          var distFromDampBoundary = height - step;
          var damp = this.getDamp( distFromDampBoundary );
          var j = j0 + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    },

    /**
     * Damp more aggressively further from the edge of the visible lattice
     * @param {number} depthInDampRegion - number of cells into the damping region
     * @returns {number} scale factor for dampening the wave
     * @private
     */
    getDamp: function( depthInDampRegion ) {
      return (1 - depthInDampRegion * 0.0001);
    },

    /**
     * Propagates the wave by one step.  This is a discrete algorithm and cannot use dt.
     * @public
     */
    step: function() {
      this.currentMatrixIndex = (this.currentMatrixIndex - 1 + this.matrices.length) % this.matrices.length;

      var matrix0 = this.matrices[ (this.currentMatrixIndex + 0) % this.matrices.length ];
      var matrix1 = this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ];
      var matrix2 = this.matrices[ (this.currentMatrixIndex + 2) % this.matrices.length ];
      var width = matrix0.getRowDimension();
      var height = matrix0.getColumnDimension();
      for ( var i = 0; i < width; i++ ) {
        for ( var j = 0; j < height; j++ ) {
          if ( this.getPotential( i, j ) ) {
            matrix0.set( i, j, 0 );
          }
          else {
            var neighborSum = matrix1.get( i + 1, j ) + matrix1.get( i - 1, j ) + matrix1.get( i, j + 1 ) + matrix1.get( i, j - 1 );
            var m1ij = matrix1.get( i, j );
            var value = m1ij * 2 - matrix2.get( i, j ) + waveSpeedSquared * (neighborSum + m1ij * -4);
            matrix0.set( i, j, value );
          }
        }
      }

      // temporal dampen on the visible region
      this.dampHorizontalTemporal( this.dampY, 1, matrix0, matrix2 );
      this.dampHorizontalTemporal( this.height - 1 - this.dampY, -1, matrix0, matrix2 );
      this.dampVerticalTemporal( this.dampX, +1, matrix0, matrix2 );
      this.dampVerticalTemporal( this.width - 1 - this.dampX, -1, matrix0, matrix2 );

      // decay the wave outside of the visible part
      this.decayVertical( 0, +1, this.dampY / 2 );
      this.decayVertical( this.width - 1, -1, this.dampY / 2 );
      this.decayHorizontal( 0, +1, this.dampX / 2 );
      this.decayHorizontal( this.height - 1, -1, this.dampX / 2 );

      this.changedEmitter.emit();
    }
  } );
} );