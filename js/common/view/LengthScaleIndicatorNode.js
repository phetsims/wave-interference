// Copyright 2018-2019, University of Colorado Boulder

/**
 * Appears above the lattice and shows the scale, like this:
 * |<------>| 500 nm
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  class LengthScaleIndicatorNode extends Node {

    /**
     * @param {number} width - width of the indicator
     * @param {string} string - text to display to the right of the indicator
     * @param {Object} [options]
     */
    constructor( width, string, options ) {

      const text = new WaveInterferenceText( string, {
        font: WaveInterferenceConstants.TIME_AND_LENGTH_SCALE_INDICATOR_FONT
      } );

      const createBar = centerX => new Line( 0, 0, 0, text.height, { stroke: 'black', centerX: centerX } );
      const leftBar = createBar( -width / 2 );
      const rightBar = createBar( width / 2 );
      const arrowNode = new ArrowNode( leftBar.right + 1, leftBar.centerY, rightBar.left - 1, rightBar.centerY, {
        doubleHead: true,
        headHeight: 5,
        headWidth: 5,
        tailWidth: 2
      } );
      text.leftCenter = rightBar.rightCenter.plusXY( 5, 0 );

      super( _.extend( {
        children: [ arrowNode, leftBar, rightBar, text ]
      }, options ) );
    }
  }

  return waveInterference.register( 'LengthScaleIndicatorNode', LengthScaleIndicatorNode );
} );