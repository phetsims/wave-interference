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
  var WAVE_SPEED = 0.5; // The wave speed in the coordinate frame of the lattice, see http://www.mtnmath.com/whatth/node47.html
  var WAVE_SPEED_SQUARED = WAVE_SPEED * WAVE_SPEED; // precompute to speed up propagation
  var NUMBER_OF_MATRICES = 3; // The algorithm we use for the discretized wave equation requires current value + 2 history points

  /**
   * @param {number} width - width of the lattice
   * @param {number} height - height of the lattice
   * @param {number} dampX - number of cells on the left and again on the right to use for damping
   * @param {number} dampY - number of cells on the top and again on the bottom to use for damping
   * @constructor
   */
  function Lattice( width, height, dampX, dampY ) {

    // @public (read-only) {number} number of cells on the left and again on the right to use for damping
    this.dampX = dampX;

    // @public (read-only) {number} number of cells on the top and again on the bottom to use for damping
    this.dampY = dampY;

    // @private {Matrix[]} matrices for current value, previous value and value before previous
    this.matrices = [];
    for ( var i = 0; i < NUMBER_OF_MATRICES; i++ ) {
      this.matrices.push( new Matrix( width, height ) );
    }

    // @private {Matrix} - keeps track of which cells have been visited by the wave
    this.visitedMatrix = new Matrix( width, height );

    // @private {number} indicates the current matrix. Previous matrix is one higher (with correct modulus)
    this.currentMatrixIndex = 0;

    // @private {function} returns true if there is a potential barrier at the given coordinate
    this.potentialFunction = null;

    // @public {Emitter} sends a notification each time the lattice updates
    this.changedEmitter = new Emitter();

    // @public {number} (read-only) width of the lattice (includes damping regions)
    this.width = width;

    // @public {number} (read-only) height of the lattice (includes damping regions)
    this.height = height;
  }

  waveInterference.register( 'Lattice', Lattice );

  return inherit( Object, Lattice, {

    /**
     * Read the values on the center line of the lattice (omits the out-of-bounds damping regions), for display in the
     * WaveAreaGraphNode
     * @param {number[]} array - array to fill with the values for performance/memory, will be resized if necessary
     * @public
     */
    getCenterLineValues: function( array ) {
      var samplingWidth = this.width - this.dampX * 2;

      // Resize array if necessary
      if ( array.length !== samplingWidth ) {
        array.length = 0;
      }
      var samplingHeight = Math.round( this.height / 2 );
      for ( var i = 0; i < this.width - this.dampX * 2; i++ ) {
        array[ i ] = this.getCurrentValue( i + this.dampX, samplingHeight );
      }
      return array;
    },

    /**
     * Returns the current value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @returns {number}
     * @public
     */
    getCurrentValue: function( i, j ) {
      return this.matrices[ this.currentMatrixIndex ].get( i, j );
    },

    /**
     * Sets the current value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @param {number} value
     * @public
     */
    setCurrentValue: function( i, j, value ) {
      this.matrices[ this.currentMatrixIndex ].set( i, j, value );
    },

    /**
     * Returns the previous value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @private
     */
    getLastValue: function( i, j ) {
      return this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].get( i, j );
    },

    /**
     * Sets the previous value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @param {number} value
     * @private
     */
    setLastValue: function( i, j, value ) {
      this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].set( i, j, value );
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

    cellHasBeenVisited: function( i, j ) {
      return this.visitedMatrix.get( i, j ) === 1;
    },

    /**
     * Damp more aggressively further from the edge of the visible lattice
     * @param {number} depthInDampRegion - number of cells into the damping region
     * @returns {number} scale factor for dampening the wave
     * @private
     */
    getDamp: function( depthInDampRegion ) {
      return ( 1 - depthInDampRegion * 0.0001 );
    },

    /**
     * Resets all of the wave values to 0
     * @public
     */
    clear: function() {
      for ( var i = 0; i < this.matrices.length; i++ ) {
        this.matrices[ i ].timesEquals( 0 );
      }

      this.visitedMatrix.timesEquals( 0 );
    },

    /**
     * Gets the values on the right hand side of the wave, for determining intensity
     * @returns {number[]}
     * @public
     */
    getRightmostColumn: function() {

      // TODO(performance): garbage-free form?  Would require preallocating the entire intensitySample matrix
      var column = [];
      for ( var j = this.dampY; j < this.height - this.dampY; j++ ) {
        column.push( this.getCurrentValue( this.width - this.dampX - 1, j ) );
      }
      return column;
    },

    /**
     * @param {Function} potentialFunction (i,j)=>boolean, true if there is a barrier at that cell location
     * @public
     */
    setPotentialFunction: function( potentialFunction ) {
      this.potentialFunction = potentialFunction;
    },

    /**
     * Propagates the wave by one step.  This is a discrete algorithm and cannot use dt.
     * @public
     */
    step: function() {
      this.currentMatrixIndex = ( this.currentMatrixIndex - 1 + this.matrices.length ) % this.matrices.length;

      var matrix0 = this.matrices[ ( this.currentMatrixIndex + 0 ) % this.matrices.length ];
      var matrix1 = this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ];
      var matrix2 = this.matrices[ ( this.currentMatrixIndex + 2 ) % this.matrices.length ];
      var width = matrix0.getRowDimension();
      var height = matrix0.getColumnDimension();
      for ( var i = 1; i < width - 1; i++ ) {
        for ( var j = 1; j < height - 1; j++ ) {
          if ( this.potentialFunction && this.potentialFunction( i, j ) ) {
            matrix0.set( i, j, 0 );
          }
          else {
            var neighborSum = matrix1.get( i + 1, j ) + matrix1.get( i - 1, j ) + matrix1.get( i, j + 1 ) + matrix1.get( i, j - 1 );
            var m1ij = matrix1.get( i, j );
            var value = m1ij * 2 - matrix2.get( i, j ) + WAVE_SPEED_SQUARED * ( neighborSum + m1ij * -4 );
            matrix0.set( i, j, value );

            if ( Math.abs( value ) > 1E-2 ) {
              this.visitedMatrix.set( i, j, 1 );
            }
          }
        }
      }

      // temporal dampen on the visible region
      this.dampHorizontalTemporal( 0, 1, matrix0, matrix2 );
      this.dampHorizontalTemporal( this.height - 1, -1, matrix0, matrix2 );
      this.dampVerticalTemporal( 0, +1, matrix0, matrix2 );
      this.dampVerticalTemporal( this.width - 1, -1, matrix0, matrix2 );

      // decay the wave outside of the visible part
      this.decayVertical( 0, +1, this.dampY / 2 );
      this.decayVertical( this.width - 1, -1, this.dampY / 2 );
      this.decayHorizontal( 0, +1, this.dampX / 2 );
      this.decayHorizontal( this.height - 1, -1, this.dampX / 2 );

      this.changedEmitter.emit();
    }
  } );
} );