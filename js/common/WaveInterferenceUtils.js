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