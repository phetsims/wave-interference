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
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {number} lineHeight
   * @param {number} width
   * @param {Object} [options] - uses the pattern identified in https://github.com/phetsims/tasks/issues/730#issuecomment-370860967
   * @constructor
   */
  function DoubleHeadedArrowWithBarsNode( lineHeight, width, options ) {
    options = _.extend( {
      lineOptions: null,
      arrowOptions: null
    }, options );

    options.lineOptions = _.extend( {
      stroke: 'black'
    }, options.lineOptions );

    var createLine = function() {
      return new Line( 0, 0, 0, lineHeight, options.lineOptions );
    };
    var line1 = createLine();
    var line2 = createLine();

    var desiredArrowWidth = width - line1.width / 2 - line2.width / 2;
    options.arrowOptions = _.extend( {
      doubleHead: true,
      headHeight: 5,
      headWidth: 5,
      tailWidth: 2,

      // ArrowNode is created a little bit larger than the specified width, so shrink it down to compensate.
      // The middle of the left line to the middle of the right line should be the given width
      maxWidth: desiredArrowWidth
    }, options.arrowOptions );
    var arrowNode = new ArrowNode( 0, 0, desiredArrowWidth, 0, options.arrowOptions );

    // Layout
    arrowNode.leftCenter = line1.rightCenter;
    line2.leftCenter = arrowNode.rightCenter;

    Node.call( this, {
      children: [ line1, arrowNode, line2 ]
    } );
    this.mutate( options );
  }

  waveInterference.register( 'DoubleHeadedArrowWithBarsNode', DoubleHeadedArrowWithBarsNode );

  return inherit( Node, DoubleHeadedArrowWithBarsNode );
} );