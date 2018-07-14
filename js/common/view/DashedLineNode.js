// Copyright 2018, University of Colorado Boulder

/**
 * When the graph is selected, the dotted line is shown in the center of the WaveAreaNode and in the graph's center.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const LineStyles = require( 'KITE/util/LineStyles' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class DashedLineNode extends Path {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      const line = Shape.lineSegment( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, 0 );
      const dashedShape = line.getDashedShape( [ 16 ], 0 );
      const strokedShape = dashedShape.getStrokedShape( new LineStyles( {
        lineWidth: 4,
        lineCap: 'round'
      } ) );

      super( strokedShape, _.extend( {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      }, options ) );
    }
  }

  waveInterference.register( 'DashedLineNode', DashedLineNode );

  return DashedLineNode;
} );