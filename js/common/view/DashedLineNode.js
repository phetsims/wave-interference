// Copyright 2018, University of Colorado Boulder

/**
 * When the graph is selected, the dotted line is shown in the center of the WaveAreaNode and in the graph's center.
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
   * @param {Object} [options]
   * @constructor
   */
  function DashedLineNode( options ) {

    var line = Shape.lineSegment( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, 0 );
    var dashedShape = line.getDashedShape( [ 16 ], 0 );
    var strokedShape = dashedShape.getStrokedShape( new LineStyles( {
      lineWidth: 4,
      lineCap: 'round'
    } ) );

    Path.call( this, strokedShape, _.extend( {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    }, options ) );
  }

  waveInterference.register( 'DashedLineNode', DashedLineNode );

  return inherit( Path, DashedLineNode );
} );