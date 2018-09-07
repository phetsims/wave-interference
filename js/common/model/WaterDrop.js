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
     * @param {number} frequency in the units of the water scene
     * @param {number} amplitude - strength of the wave
     * @param {number} y - distance to fall before the particles meets the plane of the lattice
     * TODO: indicate what lattice cell it is aiming for
     */
    constructor( frequency, amplitude, y ) {

      // @public
      this.y = y;
      this.frequency = frequency;
      this.amplitude = amplitude;

      // TODO: to end the water, send a drop with 0 amplitude?  Or an off signal?
    }
  }

  return waveInterference.register( 'WaterDrop', WaterDrop );
} );