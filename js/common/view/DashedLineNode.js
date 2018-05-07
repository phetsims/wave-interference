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
  var LineStyles = require( 'KITE/util/LineStyles' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * TODO: Use Kite to create stroked shape from shape
   * @param {Object} [options]
   * @constructor
   */
  function DashedLineNode( options ) {

    // stroke styles for the wire shapes.
    var strokeStyles = new LineStyles( {
      lineWidth: 4,
      lineCap: 'round',
      lineDash: [ 16.2, 16.2 ] // TODO: this doesn't seem to be working yet
    } );

    var line = new Shape().moveTo( 0, 0 ).lineTo( WaveInterferenceConstants.WAVE_AREA_WIDTH, 0 );
    var dashedLine = line.getStrokedShape( strokeStyles );

    Path.call( this, dashedLine, _.extend( {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    }, options ) );
  }

  waveInterference.register( 'DashedLineNode', DashedLineNode );

  return inherit( Path, DashedLineNode );
} );