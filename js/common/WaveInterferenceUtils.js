// Copyright 2018, University of Colorado Boulder

/**
 * Utilities for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  var CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;

  /**
   * @constructor
   */
  function WaveInterferenceUtils() {
  }

  waveInterference.register( 'WaveInterferenceUtils', WaveInterferenceUtils );

  return inherit( Object, WaveInterferenceUtils, {}, {


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
    getWaterSideShape: function( array, lattice, waveAreaBounds, dx, dy ) {
      lattice.getCenterLineValues( array );
      var shape = new Shape();

      for ( var i = 0; i < array.length; i++ ) {
        var value = array[ i ];
        var x = Util.linear( 0, array.length - 1, waveAreaBounds.left, waveAreaBounds.right, i ) + dx;
        var y = Util.linear( 0, 5, waveAreaBounds.centerY, waveAreaBounds.centerY - 100, value ) + dy;
        shape.lineTo( x, y );
      }
      return shape;
    },

    /**
     * Gets the bounds to use for a canvas (webgl or canvas), in view coordinates
     * @param {Lattice} lattice
     * @public
     * @static
     */
    getCanvasBounds: function( lattice ) {
      return new Bounds2( 0, 0, ( lattice.width - lattice.dampX * 2 ) * CELL_WIDTH, ( lattice.height - lattice.dampY * 2 ) * CELL_WIDTH );
    }
  } );
} );