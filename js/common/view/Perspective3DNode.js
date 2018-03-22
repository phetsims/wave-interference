// Copyright 2018, University of Colorado Boulder

/**
 * Shows the partially rotated wave view in a pseudo-3D view.  Ported from RotationGlyph.java
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  /**
   * @param {Bounds2} waveAreaBounds
   * @param {NumberProperty} rotationAmountProperty
   * @constructor
   */
  function Perspective3DNode( waveAreaBounds, rotationAmountProperty ) {

    // @private
    this.waveAreaBounds = waveAreaBounds;

    // @private
    this.rotationAmountProperty = rotationAmountProperty;

    // @private - depicts the top face
    this.topSurfacePath = new Path( null, { stroke: 'red', lineWidth: 4, fill: 'green', lineJoin: 'round' } );

    // @private - depicts the side face
    this.sideSurfacePath = new Path( null, { stroke: 'blue', lineWidth: 4, fill: 'white', lineJoin: 'round' } );

    // @private
    this.upNode = new HBox( {
      children: [
        new WaveInterferenceText( 'Top', { fontSize: 32 } ),
        new ArrowNode( 0, 0, 0, -110, {
          stroke: 'black',
          fill: 'yellow',
          lineWidth: 2,
          headHeight: 30,
          headWidth: 35,
          tailWidth: 20
        } )
      ]
    } );
    Node.call( this, {
      children: [ this.topSurfacePath, this.sideSurfacePath, this.upNode ]
    } );

    // Update the shapes and text when the rotationAmount has changed
    rotationAmountProperty.link( this.update.bind( this ) );
  }

  waveInterference.register( 'Perspective3DNode', Perspective3DNode );

  return inherit( Node, Perspective3DNode, {

    /**
     * Creates a shape for the top or side surface, at the correct perspective angle.
     * @param {number} reduction - amount to reduce the width at the furthest point from the center
     * @param {number} y - vertical coordinate of the surface
     * @private
     */
    createFaceShape: function( reduction, y ) {
      return new Shape()
        .moveTo( this.waveAreaBounds.left, this.waveAreaBounds.centerY )
        .lineTo( this.waveAreaBounds.left + reduction, y )
        .lineTo( this.waveAreaBounds.right - reduction, y )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.centerY ).close();
    },

    /**
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update: function() {
      var rotationAmount = this.rotationAmountProperty.get();
      var bounds = this.waveAreaBounds;
      var perspectiveWidth = bounds.width * 0.2;

      var topFaceTopY = Util.linear( 0, 1, bounds.top, bounds.centerY, rotationAmount );
      var topReduction = Util.linear( 0, 1, 0, perspectiveWidth, rotationAmount );
      var sideFaceBottomY = Util.linear( 0, 1, bounds.centerY, bounds.bottom, rotationAmount );
      var bottomReduction = Util.linear( 0, 1, perspectiveWidth, 0, rotationAmount );

      this.topSurfacePath.shape = this.createFaceShape( topReduction, topFaceTopY );
      this.sideSurfacePath.shape = this.createFaceShape( bottomReduction, sideFaceBottomY );

      // Position the arrow and text
      this.upNode.setMatrix( Matrix3.scaling( 1, rotationAmount + 1E-6 ) );
      this.upNode.centerY = this.sideSurfacePath.centerY;
      this.upNode.right = this.sideSurfacePath.right - 80;
    }
  } );
} );