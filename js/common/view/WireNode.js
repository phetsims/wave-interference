// Copyright 2015-2017, University of Colorado Boulder

/**
 * View that connects a sensor (the probe) to its body (where the readout appears).
 * Adapted from Bending Light.  TODO: factor out?
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Wire that connects the body and probe.
   *
   * @param {Node} probeNode - node from where the wire connected
   * @param {Node} bodyNode - node to where the wire connected
   * @param {Color} color - color of the wire
   * @param {number} verticalWireAttachmentPoint - how far (0-1) down the left edge of the body node to attach the wire
   * @constructor
   */
  function WireNode( probeNode, bodyNode, color, verticalWireAttachmentPoint ) {

    this.probeNode = probeNode; // @public (read-only)
    this.bodyNode = bodyNode; // @public (read-only)
    this.color = color; // @public (read-only)

    Path.call( this, null, {
      lineWidth: 3,
      stroke: color
    } );
    var self = this;

    this.updateWireShape = function() {

      // connect left-center of body to bottom-center of probe.
      var bodyConnectionPointX = bodyNode.x + bodyNode.width;
      var bodyConnectionPointY = bodyNode.y + bodyNode.height * verticalWireAttachmentPoint;
      var probeConnectionPointX = probeNode.centerX;
      var probeConnectionPointY = probeNode.bottom;

      var connectionPointXOffsetFactor = 25;

      self.shape = new Shape()
        .moveTo( bodyConnectionPointX, bodyConnectionPointY )
        .cubicCurveTo(
          bodyConnectionPointX + connectionPointXOffsetFactor, bodyConnectionPointY,
          probeConnectionPointX, probeConnectionPointY + connectionPointXOffsetFactor,
          probeConnectionPointX, probeConnectionPointY
        );
    };

    this.updateWireShape();
  }

  waveInterference.register( 'WireNode', WireNode );

  return inherit( Path, WireNode );
} );