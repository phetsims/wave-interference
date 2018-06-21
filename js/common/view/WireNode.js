// Copyright 2018, University of Colorado Boulder

/**
 * View that typically connects a sensor (like a ProbeNode) to its body (where the readout value or chart appears).
 * TODO: Move to common code and use this in Bending Light
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * Wire that connects the body and probe.
   *
   * @param {Property.<Vector2>} position1Property
   * @param {Property.<Vector2>} normal1Property - defines the control point of the cubic curve, relative to the start position
   * @param {Property.<Vector2>} position2Property
   * @param {Property.<Vector2>} normal2Property - defines the control point of the cubic curve, relative to the end position
   * @param {Object} [options]
   * @constructor
   */
  function WireNode( position1Property, normal1Property, position2Property, normal2Property, options ) {
    var self = this;
    Path.call( this, null, options );

    // @private
    this.multilink = Property.multilink( [
      position1Property, normal1Property, position2Property, normal2Property
    ], function( position1, normal1, position2, normal2 ) {
      self.shape = new Shape()
        .moveToPoint( position1 )
        .cubicCurveToPoint(
          position1.plus( normal1 ),
          position2.plus( normal2 ),
          position2
        );
    } );
  }

  waveInterference.register( 'WireNode', WireNode );

  return inherit( Path, WireNode, {

    /**
     * Unlink listeners when disposed.
     * @public
     */
    dispose: function() {
      this.multilink.dispose();
    }
  }, {

    /**
     * Creates an axon Property for the position relative to the bounds of a Node.
     * @param {Node} node
     * @param {function|string} getLocation, for example:
     *                                       function(node){ return node.center.plusXY(5,5); } or 'leftBottom'
     */
    createProperty: function( node, getLocation ) {

      assert && assert( typeof getLocation === 'string' || typeof getLocation === 'function', 'wrong type for getLocation' );

      // Read-only Property that describes a part relative to the bounds of the node.
      var positionProperty = new Property();

      // When the node Bounds change, update the position property
      var updateProperty = function() {
        var position = ( typeof getLocation === 'string' ) ? node[ getLocation ] : getLocation( node );
        assert && assert( position, 'position should be defined' );
        positionProperty.value = position;
      };
      node.on( 'bounds', updateProperty );
      updateProperty();
      return positionProperty;
    },

    aboveBottomRight: function( fractionFromBottom ) {
      return function( node ) {
        return node.rightBottom.plusXY( 0, -node.height * fractionFromBottom );
      };
    }
  } );
} );