// Copyright 2017-2020, University of Colorado Boulder

/**
 * The lattice is a 2D grid with a value in each cell that represents the wave amplitude at that point.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix from '../../../../dot/js/Matrix.js';
import waveInterference from '../../waveInterference.js';

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
const LIGHT_VISIT_THRESHOLD = 1E-3;

class Lattice {

  // matrices for current value, previous value and value before previous
  private readonly matrices: Matrix[] = [];

  // keeps track of which cells have been visited by the wave
  private readonly visitedMatrix: Matrix;

  // tracks which cells could have been activated by an source disturbance, as opposed to a numerical
  // artifact or reflection.  See TemporalMask.  Initialize to 1 to support plane waves, which is never masked.
  private readonly allowedMask: Matrix;

  // indicates the current matrix. Previous matrix is one higher (with correct modulus)
  private currentMatrixIndex = 0;

  // sends a notification each time the lattice updates.
  public readonly changedEmitter = new Emitter();

  // Determines how far we have animated between the "last" and "current" matrices, so that we
  // can use getInterpolatedValue to update the view at 60fps even though the model is running at a slower rate.
  // See EventTimer.getRatio for more about this value.
  public interpolationRatio = 0;

  // a Bounds2 representing the visible (non-damping) region of the lattice.
  public readonly visibleBounds: Bounds2;

  public static WAVE_SPEED = WAVE_SPEED;

  /**
   * @param width - width of the lattice (includes damping regions)
   * @param height - height of the lattice (includes damping regions)
   * @param dampX - number of cells on the left and again on the right to use for damping
   * @param dampY - number of cells on the top and again on the bottom to use for damping
   */
  public constructor( public readonly width: number, public readonly height: number, public readonly dampX: number, public readonly dampY: number ) {

    for ( let i = 0; i < NUMBER_OF_MATRICES; i++ ) {
      this.matrices.push( new Matrix( width, height ) );
    }
    this.visitedMatrix = new Matrix( width, height );
    this.allowedMask = new Matrix( width, height, 1 );
    this.width = width;
    this.height = height;
    this.visibleBounds = new Bounds2( this.dampX, this.dampY, this.width - this.dampX, this.height - this.dampY );
  }

  /**
   * Gets a Bounds2 representing the full region of the lattice, including damping regions.
   */
  public getBounds(): Bounds2 {
    return new Bounds2( 0, 0, this.width, this.height );
  }

  /**
   * Returns true if the visible bounds contains the lattice coordinate
   * @param i - integer for the horizontal coordinate
   * @param j - integer for the vertical coordinate
   */
  public visibleBoundsContains( i: number, j: number ): boolean {
    const b = this.visibleBounds;

    // Note this differs from the standard Bounds2.containsCoordinate because we must exclude right and bottom edge
    // from reading one cell off the visible lattice, see https://github.com/phetsims/wave-interference/issues/86
    return b.minX <= i && i < b.maxX && b.minY <= j && j < b.maxY;
  }

  /**
   * Returns true if the given coordinate is within the lattice
   * @param i - integer for the horizontal coordinate
   * @param j - integer for the vertical coordinate
   */
  public contains( i: number, j: number ): boolean {
    return i >= 0 && i < this.width && j >= 0 && j < this.height;
  }

  /**
   * Read the values on the center line of the lattice (omits the out-of-bounds damping regions), for display in the
   * WaveAreaGraphNode
   * @param array - array to fill with the values for performance/memory, will be resized if necessary
   */
  public getCenterLineValues( array: number[] ): void {
    const samplingWidth = this.width - this.dampX * 2;

    // Resize array if necessary
    if ( array.length !== samplingWidth ) {
      array.length = 0;
    }
    const samplingVerticalPosition = Math.floor( this.height / 2 ); // 50.5 is the center, but we want 50.0
    for ( let i = 0; i < this.width - this.dampX * 2; i++ ) {
      array[ i ] = this.getCurrentValue( i + this.dampX, samplingVerticalPosition );
    }
  }

  /**
   * Returns the current value in the given cell, masked by the allowedMask.
   * @param i - horizontal integer coordinate
   * @param j - vertical integer coordinate
   */
  public getCurrentValue( i: number, j: number ): number {
    return this.allowedMask.get( i, j ) === 1 ? this.matrices[ this.currentMatrixIndex ].get( i, j ) : 0;
  }

  /**
   * Returns the interpolated value of the given cell, masked by the allowedMask.
   * @param i - horizontal integer coordinate
   * @param j - vertical integer coordinate
   */
  public getInterpolatedValue( i: number, j: number ): number {
    if ( this.allowedMask.get( i, j ) === 1 ) {
      const currentValue = this.getCurrentValue( i, j );
      const lastValue = this.getLastValue( i, j );
      return currentValue * this.interpolationRatio + lastValue * ( 1 - this.interpolationRatio );
    }
    else {
      return 0;
    }
  }

  /**
   * Sets the current value in the given cell
   * @param i - horizontal integer coordinate
   * @param j - vertical integer coordinate
   * @param value
   */
  public setCurrentValue( i: number, j: number, value: number ): void {
    this.matrices[ this.currentMatrixIndex ].set( i, j, value );
  }

  /**
   * Returns the previous value in the given cell
   * @param i - horizontal integer coordinate
   * @param j - vertical integer coordinate
   */
  private getLastValue( i: number, j: number ): number {
    return this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].get( i, j );
  }

  /**
   * Sets the previous value in the given cell
   * @param i - horizontal integer coordinate
   * @param j - vertical integer coordinate
   * @param value
   */
  private setLastValue( i: number, j: number, value: number ): void {
    this.matrices[ ( this.currentMatrixIndex + 1 ) % this.matrices.length ].set( i, j, value );
  }

  /**
   * In order to prevent numerical artifacts in the point source scenes, we use TemporalMask to identify which cells
   * have a value because of the source oscillation.
   * @param i
   * @param j
   * @param allowed - true if the temporal mask indicates that the value could have been caused by sources
   */
  public setAllowed( i: number, j: number, allowed: boolean ): void {
    this.allowedMask.set( i, j, allowed ? 1 : 0 );
  }

  /**
   * Determines whether the incoming wave has reached the cell.
   * @param i - horizontal coordinate to check
   * @param j - vertical coordinate to check
   */
  public hasCellBeenVisited( i: number, j: number ): boolean {
    return this.visitedMatrix.get( i, j ) === 1 && this.allowedMask.get( i, j ) === 1;
  }

  /**
   * Resets all of the wave values to 0.
   */
  public clear(): void {
    this.clearRight( 0 );
  }

  /**
   * Clear everything at and to the right of the specified column.
   * @param column - integer index of the column to start clearing at.
   */
  public clearRight( column: number ): void {
    for ( let i = column; i < this.width; i++ ) {
      for ( let j = 0; j < this.height; j++ ) {
        for ( let k = 0; k < this.matrices.length; k++ ) {
          this.matrices[ k ].set( i, j, 0 );
        }
        this.visitedMatrix.set( i, j, 0 );
        this.allowedMask.set( i, j, 1 ); // Initialize to 1 to support plane waves, which is never masked.
      }
    }
    this.changedEmitter.emit();
  }

  /**
   * Gets the values on the right hand side of the wave (before the damping region), for determining intensity.
   */
  public getOutputColumn(): number[] {

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
   */
  public step(): void {

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

    // Numerical computation of absorbing boundary conditions, under the assumption that the wave is perpendicular
    // to the edge, see https://www.phy.ornl.gov/csep/sw/node22.html.  This assumption does not hold everywhere, but
    // it is a helpful approximation.
    // Note there is a Fortran error on the top boundary and in the equations, replace:
    // u2 => matrix1.get
    // u1 => matrix2.get
    // cb => WAVE_SPEED

    // Left edge
    let i = 0;
    for ( let j = 0; j < height; j++ ) {
      const sum = matrix1.get( i, j ) + matrix1.get( i + 1, j ) - matrix2.get( i + 1, j ) + WAVE_SPEED *
                  ( matrix1.get( i + 1, j ) - matrix1.get( i, j ) + matrix2.get( i + 1, j ) - matrix2.get( i + 2, j ) );
      matrix0.set( i, j, sum );
    }

    // Right edge
    i = width - 1;
    for ( let j = 0; j < height; j++ ) {
      const sum = matrix1.get( i, j ) + matrix1.get( i - 1, j ) - matrix2.get( i - 1, j ) + WAVE_SPEED *
                  ( matrix1.get( i - 1, j ) - matrix1.get( i, j ) + matrix2.get( i - 1, j ) - matrix2.get( i - 2, j ) );
      matrix0.set( i, j, sum );
    }

    // Top edge
    let j = 0;
    for ( let i = 0; i < width; i++ ) {
      const sum = matrix1.get( i, j ) + matrix1.get( i, j + 1 ) - matrix2.get( i, j + 1 ) + WAVE_SPEED *
                  ( matrix1.get( i, j + 1 ) - matrix1.get( i, j ) + matrix2.get( i, j + 1 ) - matrix2.get( i, j + 2 ) );
      matrix0.set( i, j, sum );
    }

    // Bottom edge
    j = height - 1;
    for ( let i = 0; i < width; i++ ) {
      const sum = matrix1.get( i, j ) + matrix1.get( i, j - 1 ) - matrix2.get( i, j - 1 ) + WAVE_SPEED *
                  ( matrix1.get( i, j - 1 ) - matrix1.get( i, j ) + matrix2.get( i, j - 1 ) - matrix2.get( i, j - 2 ) );
      matrix0.set( i, j, sum );
    }
  }
}

waveInterference.register( 'Lattice', Lattice );
export default Lattice;
