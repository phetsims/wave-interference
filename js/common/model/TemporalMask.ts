// Copyright 2019-2022, University of Colorado Boulder

/**
 * Records on and off times of a single source, so that we can determine whether it could have contributed to the value
 * on the lattice at a later time.  This is used to prevent artifacts when the wave is turned off, and to restore
 * the lattice to black (for light), see https://github.com/phetsims/wave-interference/issues/258
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import Lattice from '../../../../scenery-phet/js/Lattice.js';

class TemporalMask {

  // record of changes in wave disturbance sources.
  private deltas: ( { isSourceOn: boolean; numberOfSteps: number; verticalLatticeCoordinate: number } )[] = [];

  /**
   * Set the current state of the model.  If this differs from the prior state type (in position or whether it is on)
   * a delta is generated.
   * @param isSourceOn - true if the source is on, false if the source is off
   * @param numberOfSteps - integer number of times the wave has been stepped on the lattice
   * @param verticalLatticeCoordinate - vertical lattice coordinate
   */
  public set( isSourceOn: boolean, numberOfSteps: number, verticalLatticeCoordinate: number ): void {
    const lastDelta = this.deltas.length > 0 ? this.deltas[ this.deltas.length - 1 ] : null;
    if ( this.deltas.length === 0 || lastDelta!.isSourceOn !== isSourceOn || lastDelta!.verticalLatticeCoordinate !== verticalLatticeCoordinate ) {

      // record a delta
      this.deltas.push( {
        isSourceOn: isSourceOn,
        numberOfSteps: numberOfSteps,
        verticalLatticeCoordinate: verticalLatticeCoordinate
      } );
    }
  }

  /**
   * Determines if the wave source was turned on at a time that contributed to the cell value
   * @param horizontalLatticeCoordinate - horizontal coordinate on the lattice (i)
   * @param verticalLatticeCoordinate - vertical coordinate on the lattice (j)
   * @param numberOfSteps - integer number of times the wave has been stepped on the lattice
   */
  public matches( horizontalLatticeCoordinate: number, verticalLatticeCoordinate: number, numberOfSteps: number ): boolean {

    // search to see if the source contributed to the value at the specified coordinate at the current numberOfSteps
    for ( let k = 0; k < this.deltas.length; k++ ) {
      const delta = this.deltas[ k ];
      if ( delta.isSourceOn ) {

        const horizontalDelta = WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE - horizontalLatticeCoordinate;
        const verticalDelta = delta.verticalLatticeCoordinate - verticalLatticeCoordinate;
        const distance = Math.sqrt( horizontalDelta * horizontalDelta + verticalDelta * verticalDelta );

        // Find out when this delta is in effect
        const startTime = delta.numberOfSteps;
        const endTime = this.deltas[ k + 1 ] ? this.deltas[ k + 1 ].numberOfSteps : numberOfSteps;

        const theoreticalTime = numberOfSteps - distance / Lattice.WAVE_SPEED;

        // if theoreticalDistance matches any time in this range, the cell's value was caused by the oscillators, and
        // not by a reflection or numerical artifact.  The tolerance is necessary because the actual group velocity
        // of the tip exceeds the theoretical speed, and the group velocity at the tail is lower than the theoretical
        // speed.  If the tolerance is too tight, this appears as an unnatural "clipping" of the wave area graph.
        const headTolerance = 2;
        const tailTolerance = 4;
        if ( theoreticalTime >= startTime - headTolerance && theoreticalTime <= endTime + tailTolerance ) {

          // Return as early as possible to improve performance
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Remove delta values that are so old they can no longer impact the model, to avoid memory leaks and too much CPU
   * @param maxDistance - the furthest a point can be from a source
   * @param numberOfSteps - integer number of times the wave has been stepped on the lattice
   */
  public prune( maxDistance: number, numberOfSteps: number ): void {

    // Save enough deltas so that even if the user toggles the source on and off rapidly, the effect will be further
    // from the source.  But don't save so many deltas that performance is degraded.
    // See https://github.com/phetsims/wave-interference/issues/319
    while ( this.deltas.length > 10 ) {
      this.deltas.shift(); // remove oldest deltas first
    }
  }

  /**
   * Clear the state.
   */
  public clear(): void {
    this.deltas.length = 0;
  }
}

waveInterference.register( 'TemporalMask', TemporalMask );
export default TemporalMask;