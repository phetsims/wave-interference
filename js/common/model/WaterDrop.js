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

  class WaterDrop {

    /**
     * @param {number} amplitude - strength of the wave
     * @param {number} targetCellJ - the vertical coordinate of the cell that the water drop is falling to
     * @param {number} y - distance to fall before the particles meets the plane of the lattice
     * @param {function} onAbsorption - called when the water drop is absorbed by the lattice
     *
     * TODO: indicate what lattice cell it is aiming for so we can support two sources
     * TODO: this will require factoring out a "desiredPosition" or "desiredSeparation"
     */
    constructor( amplitude, startsOscillation, targetCellJ, y, onAbsorption ) {

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
    }

    step( dt ) {

      this.y -= dt * 100; // TODO: fine tune and factor out the speed

      // Remove drop that have hit the water, and set its values to the oscillator
      if ( this.y < 0 ) {

        this.onAbsorption();
        // TODO: phase?
      }
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );