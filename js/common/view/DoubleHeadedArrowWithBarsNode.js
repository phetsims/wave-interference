// Copyright 2018, University of Colorado Boulder

/**
 * Shows a double headed arrow with bars, like this:
 * |<----->|
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // TODO: see https://github.com/phetsims/wave-interference/issues/79 about whether this should be moved to common code
  // TODO: before converting to ES6
  class DoubleHeadedArrowWithBarsNode extends Node {

    /**
     * @param {number} lineHeight
     * @param {number} width
     * @param {Object} [options] - uses the pattern identified in https://github.com/phetsims/tasks/issues/730#issuecomment-370860967
     */
    constructor( lineHeight, width, options ) {
      options = _.extend( {
        lineOptions: null,
        arrowOptions: null
      }, options );

      options.lineOptions = _.extend( {
        stroke: 'black'
      }, options.lineOptions );

      const createLine = function() {
        return new Line( 0, 0, 0, lineHeight, options.lineOptions );
      };
      const line1 = createLine();
      const line2 = createLine();

      const desiredArrowWidth = width - line1.width / 2 - line2.width / 2;
      options.arrowOptions = _.extend( {
        doubleHead: true,
        headHeight: 5,
        headWidth: 5,
        tailWidth: 2,

        // ArrowNode is created a little bit larger than the specified width, so shrink it down to compensate.
        // The middle of the left line to the middle of the right line should be the given width
        maxWidth: desiredArrowWidth
      }, options.arrowOptions );
      const arrowNode = new ArrowNode( 0, 0, desiredArrowWidth, 0, options.arrowOptions );

      // Layout
      arrowNode.leftCenter = line1.rightCenter;
      line2.leftCenter = arrowNode.rightCenter;

      super( {
        children: [ line1, arrowNode, line2 ]
      } );
      this.mutate( options );
    }
  }

  return waveInterference.register( 'DoubleHeadedArrowWithBarsNode', DoubleHeadedArrowWithBarsNode );
} );