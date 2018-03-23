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
  var Easing = require( 'TWIXT/Easing' );
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
    this.topFacePath = new Path( null, { stroke: 'black', lineWidth: 4, lineJoin: 'round' } );

    // @private - depicts the side face (when the user selects "side view")
    this.sideFacePath = new Path( null, { stroke: 'black', lineWidth: 4, lineJoin: 'round' } );

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
      children: [ this.topFacePath, this.sideFacePath, this.upNode ]
    } );

    // Update the shapes and text when the rotationAmount has changed
    rotationAmountProperty.link( this.update.bind( this ) );
  }

  waveInterference.register( 'Perspective3DNode', Perspective3DNode );

  return inherit( Node, Perspective3DNode, {

    /**
     * Sets the top face color, when the scene changes.
     * @param {Color|string} color - the top face color
     * @public
     */
    setTopFaceColor: function( color ) {
      this.topFacePath.fill = color;
    },

    /**
     * Sets the side face color, when the scene changes.
     * @param {Color|string} color - the side face color
     * @public
     */
    setSideFaceColor: function( color ) {
      this.sideFacePath.fill = color;
    },

    /**
     * Creates a shape for the top or side Face, at the correct perspective angle.
     * @param {number} reduction - amount to reduce the width at the furthest point from the center
     * @param {number} y - vertical coordinate of the Face
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

      // Apply easing to make the transition look visually nicer
      var rotationAmount = Easing.CUBIC_IN_OUT.value( this.rotationAmountProperty.get() );
      var bounds = this.waveAreaBounds;
      var perspectiveWidth = bounds.width * 0.2;

      var topFaceTopY = Util.linear( 0, 1, bounds.top, bounds.centerY, rotationAmount );
      var topReduction = Util.linear( 0, 1, 0, perspectiveWidth, rotationAmount );
      var sideFaceBottomY = Util.linear( 0, 1, bounds.centerY, bounds.bottom, rotationAmount );
      var bottomReduction = Util.linear( 0, 1, perspectiveWidth, 0, rotationAmount );

      this.topFacePath.shape = this.createFaceShape( topReduction, topFaceTopY );
      this.sideFacePath.shape = this.createFaceShape( bottomReduction, sideFaceBottomY );

      // Position the arrow and text
      if ( rotationAmount > 0 ) {
        this.upNode.setMatrix( Matrix3.scaling( 1, rotationAmount ) );
      }
      this.upNode.visible = rotationAmount > 0;
      this.upNode.centerY = this.sideFacePath.centerY;
      this.upNode.right = this.sideFacePath.right - 80;

      // Only show the 3d perspective view while rotating
      var rotating = rotationAmount > 0 && rotationAmount < 1;
      this.topFacePath.visible = rotating;
      this.sideFacePath.visible = rotating;
    }
  } );
} );