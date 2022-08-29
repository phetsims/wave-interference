// Copyright 2018-2022, University of Colorado Boulder

/**
 * Model for a single water drop, which conveys a new value for amplitude and frequency to the model.
 * For water, the controls set desiredAmplitude, desiredFrequency.  Those values are transmitted by a water drop.
 * When reaching the water, they set the wave amplitude and frequency accordingly.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';

// constants
// Manually tuned so that the speed of the water drops visually approximates the speed of the wave in water side view
const WATER_DROP_SPEED = 140;
const INITIAL_DISTANCE_ABOVE_LATTICE = 100; // in view coordinates

class WaterDrop {

  public y = INITIAL_DISTANCE_ABOVE_LATTICE;

  // In side view, if the drop has gone beneath the water, it gets absorbed.  In this case, it means it
  // should no longer be visible.  But the modeled time that it affects the lattice is the same.
  public absorbed = false;

  /**
   * @param amplitude - strength of the wave
   * @param startsOscillation - false if this is a fake water drop to shut off the oscillation at one cycle
   * @param sourceSeparation - the vertical coordinate of the cell that the water drop is falling to.
   *                 - the distance between the sources when this drop was released, used to show the correct position
   *                 - of the water drop
   * @param sign - -1 for top faucet, +1 for bottom faucet
   * @param onAbsorption - called when the water drop is absorbed by the lattice
   */
  public constructor( public readonly amplitude: number,
                      public readonly startsOscillation: boolean,
                      public readonly sourceSeparation: number,
                      public readonly sign: number,
                      public readonly onAbsorption: () => void ) {}

  /**
   * Animate the water drop at a constant velocity toward the point at which it hits the water surface.
   * @param dt - time in seconds
   */
  public step( dt: number ): void {

    this.y -= dt * WATER_DROP_SPEED;

    // Remove drop that have hit the water, and set its values to the oscillator
    if ( this.y < 0 ) {
      this.onAbsorption();
    }
  }
}

waveInterference.register( 'WaterDrop', WaterDrop );
export default WaterDrop;
