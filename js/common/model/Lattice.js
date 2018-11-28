// Copyright 2017-2018, University of Colorado Boulder

/**
 * The lattice is a 2D grid with a value in each cell that represents the wave amplitude at that point.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Emitter = require( 'AXON/Emitter' );
  const Matrix = require( 'DOT/Matrix' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants

  // The wave speed in the coordinate frame of the lattice, see http://www.mtnmath.com/whatth/node47.html. We tried
  // different values, but they do not have the properer emergent behavior.  WAVE_SPEED=1 propagates out as a diamond
  // rather than a circle, and WAVE_SPEED=0.1 is too slow and throws off the frequency of light.
  const WAVE_SPEED = 0.5;
  const WAVE_SPEED_SQUARED = WAVE_SPEED * WAVE_SPEED; // precompute to avoid work in the inner loop
  const NUMBER_OF_MATRICES = 3; // The discretized wave equation algorithm requires current value + 2 history points

  // This is the threshold for the wave value that determines if the light has visited.  If the value is higher,
  // it will track the wavefront of the light more accurately (and hence could be used for more accurate computation of
  // the speed of light), but will generate more artifacts in the initial wave.  If the value is lower, it will generate
  // fewer artifacts in the initial propagation, but will lead the initial wavefront by too far and make it seem like
  // light is faster than it should be measured (based on the propagation of wavefronts).
  const LIGHT_VISIT_THRESHOLD = 0.06;

  // Damp more aggressively further from the edge of the visible lattice
  const DAMPING_PROFILE = [
    0.999, 0.99, 0.98, 0.97, 0.95, 0.925, 0.9, 0.85, 0.8, 0.73, 0.66, 0.6, 0.55, 0.5, 0.45, 0.42, 0.4, 0.38, 0.36
  ];

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

      // @public (read-only) {Bounds2} - a Bounds2 representing the visible (non-damping) region of the lattice.
      this.visibleBounds = new Bounds2( this.dampX, this.dampY, this.width - this.dampX, this.height - this.dampY );
    }

    /**
     * Gets a Bounds2 representing the full region of the lattice, including damping regions.
     * @returns {Bounds2}
     */
    getBounds() {
      return new Bounds2( 0, 0, this.width, this.height );
    }

    /**
     * Returns true if the visible bounds contains the lattice coordinate
     * @param {number} i - integer for the horizontal coordinate
     * @param {number} j - integer for the vertical coordinate
     * @returns {boolean}
     */
    visibleBoundsContains( i, j ) {
      const b = this.visibleBounds;

      // Note this differs from the standard Bounds2.containsCoordinate because we must exclude right and bottom edge
      // from reading one cell off the visible lattice, see https://github.com/phetsims/wave-interference/issues/86
      return b.minX <= i && i < b.maxX && b.minY <= j && j < b.maxY;
    }

    /**
     * Returns true if the given coordinate is within the lattice
     * @param {number} i - integer for the horizontal coordinate
     * @param {number} j - integer for the vertical coordinate
     * @returns {boolean}
     * @public
     */
    contains( i, j ) {
      return i >= 0 && i < this.width && j >= 0 && j < this.height;
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
      const samplingVerticalLocation = Util.roundSymmetric( this.height / 2 );
      for ( let i = 0; i < this.width - this.dampX * 2; i++ ) {
        array[ i ] = this.getCurrentValue( i + this.dampX, samplingVerticalLocation );
      }
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
      const currentValue = this.getCurrentValue( i, j );
      const lastValue = this.getLastValue( i, j );
      return currentValue * this.interpolationRatio + lastValue * ( 1 - this.interpolationRatio );
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
     * @returns {number}
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
     * Exponential decay in a vertical band to prevent reflections or artifacts from the sides of the lattice.
     * @param {number} i0 - x coordinate of the damping region
     * @param {number} sign - +1 or -1 depending on which way the damping moves
     * @param {number} width - width of the damping region
     * @private
     */
    decayVertical( i0, sign, width ) {
      for ( let j = 0; j < this.height; j++ ) {
        for ( let step = 0; step < width; step++ ) {
          const damp = DAMPING_PROFILE[ step ] || DAMPING_PROFILE[ DAMPING_PROFILE.length - 1 ];
          const i = i0 + sign * step;
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
          const damp = DAMPING_PROFILE[ step ] || DAMPING_PROFILE[ DAMPING_PROFILE.length - 1 ];
          const j = j0 + sign * step;
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
     * @public
     */
    hasCellBeenVisited( i, j ) {
      return this.visitedMatrix.get( i, j ) === 1;
    }

    /**
     * Resets all of the wave values to 0
     * @public
     */
    clear() {
      this.matrices.forEach( matrix => matrix.timesEquals( 0 ) );
      this.visitedMatrix.timesEquals( 0 );
    }

    /**
     * Gets the values on the right hand side of the wave (before the damping region), for determining intensity.
     * @returns {number[]}
     * @public
     */
    getOutputColumn() {

      // This could be implemented in garbage-free from by require preallocating the entire intensitySample matrix and
      // using an index pointer like a circular array.  However, profiling in Mac Chrome did not show a significant
      // amount of time spent in this function, hence we use the simpler implementation.
      const column = [];
      for ( let j = this.dampY; j < this.height - this.dampY; j++ ) {
        const a = this.getCurrentValue( this.width - this.dampX - 1, j );
        const b = this.getCurrentValue( this.width - this.dampX - 2, j );
        const v = ( a + b ) / 2;
        column.push( v );
      }
      return column;
    }

    /**
     * Propagates the wave by one step.  This is a discrete algorithm and cannot use dt.
     * @param {function} forcingFunction - sets values before and after the wave equation
     * @public
     */
    step( forcingFunction ) {

      // Move to the next matrix
      this.currentMatrixIndex = ( this.currentMatrixIndex - 1 + this.matrices.length ) % this.matrices.length;

      const matrix0 = this.matrices[ ( this.currentMatrixIndex + 0 ) % this.matrices.length ];
      const matrix1 = this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ];
      const matrix2 = this.matrices[ ( this.currentMatrixIndex + 2 ) % this.matrices.length ];
      const width = matrix0.getRowDimension();
      const height = matrix0.getColumnDimension();

      // Main loop, doesn't update cells on the edges
      for ( let i = 1; i < width - 1; i++ ) {
        for ( let j = 1; j < height - 1; j++ ) {
          const neighborSum = matrix1.get( i + 1, j ) +
                              matrix1.get( i - 1, j ) +
                              matrix1.get( i, j + 1 ) +
                              matrix1.get( i, j - 1 );
          const m1ij = matrix1.get( i, j );
          const value = m1ij * 2 - matrix2.get( i, j ) + WAVE_SPEED_SQUARED * ( neighborSum + m1ij * -4 );
          matrix0.set( i, j, value );

          if ( Math.abs( value ) > LIGHT_VISIT_THRESHOLD ) {
            this.visitedMatrix.set( i, j, 1 );
          }
        }
      }

      // decay the wave outside of the visible part
      this.decayVertical( this.dampX, -1, this.dampX );
      this.decayVertical( this.width - this.dampX - 1, +1, this.dampX );
      this.decayHorizontal( this.dampY, -1, this.dampY );
      this.decayHorizontal( this.height - this.dampY - 1, +1, this.dampY );

      // Apply values on top of the computed lattice values so there is no noise at the point sources
      forcingFunction();
    }
  }

  return waveInterference.register( 'Lattice', Lattice );
} );