// Copyright 2018, University of Colorado Boulder

/**
 * When the graph is selected, the dotted line is shown in the center of the WaveAreaNode and in the center
 * of the graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DottedLineNode( options ) {
    Line.call( this, 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, 0, _.extend( {
      stroke: 'white',
      lineWidth: 3,
      lineDash: [ 16.2, 16.2 ] // Adjusted so the dash begins and ends on the lattice (phase)
    }, options ) );
  }

  waveInterference.register( 'DottedLineNode', DottedLineNode );

  return inherit( Line, DottedLineNode );
} );