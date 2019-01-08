// Copyright 2019, University of Colorado Boulder

/**
 * Records on and off times of a single source, so that we can determine whether it could have contributed to the value
 * on the lattice at a later time.  This is used to prevent artifacts when the wave is turned off, and to restore
 * the lattice to black (for light).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class TemporalMask {

    constructor() {

      // @private - record of {on, time,j} of changes in wave disturbance sources.
      this.deltas = [];
    }

    /**
     * Set the current state of the model.  If this differs from the prior state type (in position or whether it is on)
     * a delta is generated.
     * @param {boolean} on - true if the source is on, false if the source is off
     * @param {number} time - integer number of times the wave has been stepped on the lattice
     * @param {number} j - vertical lattice coordinate
     * @public
     */
    set( on, time, j ) {
      const lastDelta = this.deltas.length > 0 ? this.deltas[ this.deltas.length - 1 ] : null;
      if ( this.deltas.length === 0 || lastDelta.on !== on || lastDelta.j !== j ) {

        // record a delta
        this.deltas.push( {
          on: on,
          time: time,
          j: j
        } );
      }
    }

    /**
     * Determines if the wave source was turned on at a time that contributed to the cell value
     * @param {number} i - horizontal coordinate on the lattice
     * @param {number} j - vertical coordinate on the lattice
     * @param {number} time - integer number of times the wave has been stepped on the lattice
     * @returns {boolean}
     * @public
     */
    matches( i, j, time ) {

      // search back through time to see if the source contributed to the value at (i,j) at the current time
      for ( let k = 0; k < this.deltas.length; k++ ) {
        const delta = this.deltas[ k ];
        if ( delta.on ) {

          const di = WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE - i;
          const dj = delta.j - j;
          const distance = Math.sqrt( di * di + dj * dj );

          // Find out when this delta is in effect
          const startTime = delta.time;
          const endTime = this.deltas[ k + 1 ] ? this.deltas[ k + 1 ].time : time;

          const theoreticalTime = time - distance / Lattice.WAVE_SPEED;

          // if theoreticalDistance matches any time in this range, then we have a winner
          const headTolerance = 4;
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
     * Remove delta values that are so old they can no longer impact the model, to avoid memory leaks.
     * @param {number} maxDistance - the furthest a point can be from a source
     * @param {number} time - integer number of times the wave has been stepped on the lattice
     * @public
     */
    prune( maxDistance, time ) {
      for ( let k = 0; k < this.deltas.length; k++ ) {
        const delta = this.deltas[ k ];

        const time = this.time - delta.time;

        // max time is across the diagonal of the lattice
        if ( time > maxDistance / Lattice.WAVE_SPEED ) { // d = vt, t=d/v
          this.deltas.splice( k, 1 );
          k--;
        }
      }
    }

    /**
     * Clear the state.
     * @public
     */
    clear() {
      this.deltas.length = 0;
    }
  }

  return waveInterference.register( 'TemporalMask', TemporalMask );
} );