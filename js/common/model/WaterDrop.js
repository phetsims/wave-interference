// Copyright 2018, University of Colorado Boulder

/**
 * Model for a single water drop, which conveys a new value for amplitude and frequency to the model.
 * For water, the controls set desiredAmplitude, desiredFrequency.  Those values are transmitted by a water drop.
 * When reaching the water, they set the wave amplitude and frequency accordingly.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const WATER_DROP_SPEED = 100; // TODO: fine tune the water drop speed, careful how the timing works in side view

  class WaterDrop {

    /**
     * @param {number} amplitude - strength of the wave
     * @param {boolean} startsOscillation - false if this is a "fake" water drop to shut off the oscillation at one cycle
     * @param {number} sourceSeparation - the vertical coordinate of the cell that the water drop is falling to
     * @param {number} y - distance to fall before the particles meets the plane of the lattice
     * @param {function} onAbsorption - called when the water drop is absorbed by the lattice
     */
    // TODO: jsdoc for side or pull it into sourceSeparation
    constructor( amplitude, startsOscillation, sourceSeparation, y, side, onAbsorption ) {

      // @public (read-only)
      this.amplitude = amplitude;

      // @public (read-only)
      this.startsOscillation = startsOscillation;

      // @public (read-only)
      this.y = y;

      // @public - In side view, if the drop has gone beneath the water, it gets absorbed.  In this case, it means it
      // should no longer be visible.  But the modeled time that it affects the lattice is the same.
      this.absorbed = false;

      // @public {function} - called when absorbed
      this.onAbsorption = onAbsorption;

      // @public (read-only) - the distance between the sources when this drop was released, used to show the
      // correct location of the water drop
      this.sourceSeparation = sourceSeparation;

      // @public (read-only) {string}
      this.side = side;
    }

    step( dt ) {

      this.y -= dt * WATER_DROP_SPEED;

      // Remove drop that have hit the water, and set its values to the oscillator
      if ( this.y < 0 ) {
        this.onAbsorption();
      }
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );