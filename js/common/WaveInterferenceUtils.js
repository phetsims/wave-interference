// Copyright 2018, University of Colorado Boulder

/**
 * Utilities for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;

  class WaveInterferenceUtils {


    /**
     * Gets a Shape representing the top of the water in water side view from left to right, also used for the chart.
     * @param {number[]} array
     * @param {Lattice} lattice
     * @param {Bounds2} waveAreaBounds
     * @param {number} dx
     * @param {number} dy
     * @returns {Shape}
     * @public
     */
    static getWaterSideShape( array, lattice, waveAreaBounds, dx, dy ) {
      lattice.getCenterLineValues( array );
      const shape = new Shape();

      for ( let i = 0; i < array.length; i++ ) {
        const value = array[ i ];
        const x = Util.linear( 0, array.length - 1, waveAreaBounds.left, waveAreaBounds.right, i ) + dx;
        const y = Util.linear( 0, 5, waveAreaBounds.centerY, waveAreaBounds.centerY - 100, value ) + dy;
        shape.lineTo( x, y );
      }
      return shape;
    }

    /**
     * Gets the bounds to use for a canvas, in view coordinates
     * @param {Lattice} lattice
     * @public
     * @static
     */
    static getCanvasBounds( lattice ) {
      return new Bounds2( 0, 0, ( lattice.width - lattice.dampX * 2 ) * CELL_WIDTH, ( lattice.height - lattice.dampY * 2 ) * CELL_WIDTH );
    }

    /**
     * Convert a value to femto.
     * @param {number} value
     * @returns {number}
     * @public
     */
    static toFemto( value ) {
      return value * WaveInterferenceConstants.FEMTO;
    }

    /**
     * Convert a value from femto.
     * @param {number} value
     * @returns {number}
     * @public
     */
    static fromFemto( value ) {
      return value / WaveInterferenceConstants.FEMTO;
    }
  }

  return waveInterference.register( 'WaveInterferenceUtils', WaveInterferenceUtils );
} );