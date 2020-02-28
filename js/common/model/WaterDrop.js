// Copyright 2018-2020, University of Colorado Boulder

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

  /**
   * @param {number} amplitude - strength of the wave
   * @param {boolean} startsOscillation - false if this is a fake water drop to shut off the oscillation at one cycle
   * @param {number} sourceSeparation - the vertical coordinate of the cell that the water drop is falling to
   * @param {number} sign - -1 for top faucet, +1 for bottom faucet
   * @param {function} onAbsorption - called when the water drop is absorbed by the lattice
   */
  constructor( amplitude, startsOscillation, sourceSeparation, sign, onAbsorption ) {

    // @public (read-only)
    this.amplitude = amplitude;

    // @public (read-only)
    this.startsOscillation = startsOscillation;

    // @public (read-only)
    this.y = INITIAL_DISTANCE_ABOVE_LATTICE;

    // @public - In side view, if the drop has gone beneath the water, it gets absorbed.  In this case, it means it
    // should no longer be visible.  But the modeled time that it affects the lattice is the same.
    this.absorbed = false;

    // @public (read-only) {function} - called when absorbed
    this.onAbsorption = onAbsorption;

    // @public (read-only) - the distance between the sources when this drop was released, used to show the
    // correct location of the water drop
    this.sourceSeparation = sourceSeparation;

    // @public (read-only) {string}
    this.sign = sign;
  }

  /**
   * Animate the water drop at a constant velocity toward the point at which it hits the water surface.
   * @param {number} dt - time in seconds
   * @public
   */
  step( dt ) {

    this.y -= dt * WATER_DROP_SPEED;

    // Remove drop that have hit the water, and set its values to the oscillator
    if ( this.y < 0 ) {
      this.onAbsorption();
    }
  }
}

waveInterference.register( 'WaterDrop', WaterDrop );
export default WaterDrop;