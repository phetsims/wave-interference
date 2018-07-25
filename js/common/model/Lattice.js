// Copyright 2017, University of Colorado Boulder

/**
 * The lattice is a 2D grid with a value in each cell that represents the wave amplitude at that point.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Emitter = require( 'AXON/Emitter' );
  const Matrix = require( 'DOT/Matrix' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants

  // The wave speed in the coordinate frame of the lattice, see http://www.mtnmath.com/whatth/node47.html. We tried
  // different values, but they do not have the properer emergent behavior.  WAVE_SPEED=1 propagates out as a diamond
  // rather than a circle, and WAVE_SPEED=0.1 is too slow and throws off the frequency of light.
  const WAVE_SPEED = 0.5;
  const WAVE_SPEED_SQUARED = WAVE_SPEED * WAVE_SPEED; // precompute to avoid work in the inner loop
  const NUMBER_OF_MATRICES = 3; // The algorithm we use for the discretized wave equation requires current value + 2 history points

  // This is the threshold for the wave value that determines if the light has visited.  If the value is higher,
  // it will track the wavefront of the light more accurately (and hence could be used for more accurate computation of
  // the speed of light), but will generate more artifacts in the initial wave.  If the value is lower, it will generate
  // fewer artifacts in the initial propagation, but will lead the initial wavefront by too far and make it seem like
  // light is faster than it should be measured (based on the propagation of wavefronts).
  const LIGHT_VISIT_THRESHOLD = 0.06;

  class Lattice {

    /**
     * @param {number} width - width of the lattice
     * @param {number} height - height of the lattice
     * @param {number} dampX - number of cells on the left and again on the right to use for damping
     * @param {number} dampY - number of cells on the top and again on the bottom to use for damping
     */
    constructor( width, height, dampX, dampY ) {

      // @public (read-only) {number} - number of cells on the left and again on the right to use for damping
      this.dampX = dampX;

      // @public (read-only) {number} - number of cells on the top and again on the bottom to use for damping
      this.dampY = dampY;

      // @private {Matrix[]} - matrices for current value, previous value and value before previous
      this.matrices = [];
      for ( let i = 0; i < NUMBER_OF_MATRICES; i++ ) {
        this.matrices.push( new Matrix( width, height ) );
      }

      // @private {Matrix} - keeps track of which cells have been visited by the wave
      this.visitedMatrix = new Matrix( width, height );

      // @private {number} - indicates the current matrix. Previous matrix is one higher (with correct modulus)
      this.currentMatrixIndex = 0;

      // @public {Emitter} - sends a notification each time the lattice updates.
      this.changedEmitter = new Emitter();

      // @public (read-only) {number} - width of the lattice (includes damping regions)
      this.width = width;

      // @public (read-only) {number} - height of the lattice (includes damping regions)
      this.height = height;

      // @public {number} - Determines how far we have animated between the "last" and "current" matrices, so that we
      // can use getInterpolatedValue to update the view at 60fps even though the model is running at a slower rate
      this.interpolationRatio = 0;
    }

    /**
     * Gets a Bounds2 representing the visible (non-damping) region of the lattice.
     * @returns {Bounds2}
     */
    getVisibleBounds() {
      return new Bounds2( this.dampX, this.dampY, this.width - this.dampX, this.height - this.dampY );
    }

    /**
     * Gets a Bounds2 representing the full region of the lattice, including damping regions.
     * @returns {Bounds2}
     */
    getBounds() {
      return new Bounds2( 0, 0, this.width, this.height );
    }

    /**
     * Read the values on the center line of the lattice (omits the out-of-bounds damping regions), for display in the
     * WaveAreaGraphNode
     * @param {number[]} array - array to fill with the values for performance/memory, will be resized if necessary
     * @public
     */
    getCenterLineValues( array ) {
      const samplingWidth = this.width - this.dampX * 2;

      // Resize array if necessary
      if ( array.length !== samplingWidth ) {
        array.length = 0;
      }
      const samplingVerticalLocation = Math.round( this.height / 2 );
      for ( let i = 0; i < this.width - this.dampX * 2; i++ ) {
        array[ i ] = this.getCurrentValue( i + this.dampX, samplingVerticalLocation );
      }
      return array;
    }

    /**
     * Returns the current value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @returns {number}
     * @public
     */
    getCurrentValue( i, j ) {
      return this.matrices[ this.currentMatrixIndex ].get( i, j );
    }

    /**
     * Returns the interpolated value of the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @returns {number}
     * @public
     */
    getInterpolatedValue( i, j ) {
      return this.getCurrentValue( i, j ) * this.interpolationRatio + this.getLastValue( i, j ) * ( 1 - this.interpolationRatio );
    }

    /**
     * Sets the current value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @param {number} value
     * @public
     */
    setCurrentValue( i, j, value ) {
      this.matrices[ this.currentMatrixIndex ].set( i, j, value );
    }

    /**
     * Returns the previous value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @private
     */
    getLastValue( i, j ) {
      return this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].get( i, j );
    }

    /**
     * Sets the previous value in the given cell
     * @param {number} i - horizontal integer coordinate
     * @param {number} j - vertical integer coordinate
     * @param {number} value
     * @private
     */
    setLastValue( i, j, value ) {
      this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].set( i, j, value );
    }

    /**
     * Across a horizontal line, dampen the waveform based on past adjacent values.  Developed in the Java version as
     * one step in preventing artifacts near the edge of the visible part of the lattice.
     * @param {number} j - y coordinate for the lattice
     * @param {number} dj - distance above or below to look
     * @param {Matrix} matrix0 - current matrix
     * @param {Matrix} matrix2 - two time steps ago
     * @private
     */
    dampHorizontalTemporal( j, dj, matrix0, matrix2 ) {
      for ( let i = 0; i < this.width; i++ ) {
        matrix0.set( i, j, matrix2.get( i, j + dj ) );
      }
    }

    /**
     * Across a vertical line, dampen the waveform based on past adjacent values.  Developed in the Java version as
     * one step in preventing artifacts near the edge of the visible part of the lattice.
     * @param {number} i - x coordinate for the lattice
     * @param {number} di - distance left or right to look
     * @param {Matrix} matrix0 - current matrix
     * @param {Matrix} matrix2 - two time steps ago
     * @private
     */
    dampVerticalTemporal( i, di, matrix0, matrix2 ) {
      for ( let j = 0; j < this.height; j++ ) {
        matrix0.set( i, j, matrix2.get( i + di, j ) );
      }
    }

    /**
     * Exponential decay in a vertical band to prevent reflections or artifacts from the sides of the lattice.
     * @param {number} i0 - x coordinate of the damping region
     * @param {number} sign - +1 or -1 depending on which way the damping moves
     * @param {number} width - width of the damping region
     * @private
     */
    decayVertical( i0, sign, width ) {
      for ( let j = 0; j < this.height; j++ ) {
        for ( let step = 0; step < width; step++ ) {
          const distFromDampBoundary = width - step;
          const damp = this.getDamp( distFromDampBoundary );
          const i = i0 + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    }

    /**
     * Exponential decay in a horizontal band to prevent reflections or artifacts from the sides of the lattice.
     * @param {number} j0 - y coordinate of the damping region
     * @param {number} sign - +1 or -1 depending on which way the damping moves
     * @param {number} height - height of the damping region
     * @private
     */
    decayHorizontal( j0, sign, height ) {
      for ( let i = 0; i < this.width; i++ ) {
        for ( let step = 0; step < height; step++ ) {
          const distFromDampBoundary = height - step;
          const damp = this.getDamp( distFromDampBoundary );
          const j = j0 + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    }

    /**
     * Determines whether the incoming wave has reached the cell.
     * @param {number} i - horizontal coordinate to check
     * @param {number} j - vertical coordinate to check
     * @returns {boolean}
     */
    hasCellBeenVisited( i, j ) {
      return this.visitedMatrix.get( i, j ) === 1;
    }

    /**
     * Damp more aggressively further from the edge of the visible lattice
     * @param {number} depthInDampRegion - number of cells into the damping region
     * @returns {number} scale factor for dampening the wave
     * @private
     */
    getDamp( depthInDampRegion ) {
      return ( 1 - depthInDampRegion * 0.0001 );
    }

    /**
     * Resets all of the wave values to 0
     * @public
     */
    clear() {
      for ( let i = 0; i < this.matrices.length; i++ ) {
        this.matrices[ i ].timesEquals( 0 );
      }

      this.visitedMatrix.timesEquals( 0 );
    }

    /**
     * Gets the values on the right hand side of the wave (before the damping region), for determining intensity.
     * @returns {number[]}
     * @public
     */
    getOutputColumn() {

      // TODO(performance): garbage-free form?  Would require preallocating the entire intensitySample matrix and using an index pointer
      const column = [];
      for ( let j = this.dampY; j < this.height - this.dampY; j++ ) {
        column.push( this.getCurrentValue( this.width - this.dampX - 1, j ) );
      }
      return column;
    }

    /**
     * Propagates the wave by one step.  This is a discrete algorithm and cannot use dt.
     * @param {function} forcingFunction - sets values before and after the wave equation
     * @public
     */
    step( forcingFunction ) {

      // Apply values before lattice step so the values will be used to propagate
      forcingFunction();

      this.currentMatrixIndex = ( this.currentMatrixIndex - 1 + this.matrices.length ) % this.matrices.length;

      const matrix0 = this.matrices[ ( this.currentMatrixIndex + 0 ) % this.matrices.length ];
      const matrix1 = this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ];
      const matrix2 = this.matrices[ ( this.currentMatrixIndex + 2 ) % this.matrices.length ];
      const width = matrix0.getRowDimension();
      const height = matrix0.getColumnDimension();

      // Main loop, doesn't update cells on the edges
      for ( let i = 1; i < width - 1; i++ ) {
        for ( let j = 1; j < height - 1; j++ ) {
          const neighborSum = matrix1.get( i + 1, j ) + matrix1.get( i - 1, j ) + matrix1.get( i, j + 1 ) + matrix1.get( i, j - 1 );
          const m1ij = matrix1.get( i, j );
          const value = m1ij * 2 - matrix2.get( i, j ) + WAVE_SPEED_SQUARED * ( neighborSum + m1ij * -4 );
          matrix0.set( i, j, value );

          if ( Math.abs( value ) > LIGHT_VISIT_THRESHOLD ) {
            this.visitedMatrix.set( i, j, 1 );
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

      // Apply values on top of the computed lattice values so there is no noise at the point sources
      forcingFunction();
    }
  }

  return waveInterference.register( 'Lattice', Lattice );
} );