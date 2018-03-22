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
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update: function() {
      var rotationAmount = this.rotationAmountProperty.get();

      var topSurfaceY = Util.linear( 0, 1, this.waveAreaBounds.top, this.waveAreaBounds.centerY, rotationAmount );
      var topReduction = Util.linear( 0, 1, 0, this.waveAreaBounds.width * 0.2, rotationAmount );
      this.topSurfacePath.shape = new Shape()
        .moveTo( this.waveAreaBounds.left, this.waveAreaBounds.centerY )
        .lineTo( this.waveAreaBounds.left + topReduction, topSurfaceY )
        .lineTo( this.waveAreaBounds.right - topReduction, topSurfaceY )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.centerY ).close();

      var bottomSurfaceY = Util.linear( 0, 1, this.waveAreaBounds.centerY, this.waveAreaBounds.bottom, rotationAmount );
      var bottomReduction = Util.linear( 0, 1, this.waveAreaBounds.width * 0.2, 0, rotationAmount );
      this.sideSurfacePath.shape = new Shape()
        .moveTo( this.waveAreaBounds.left, this.waveAreaBounds.centerY )
        .lineTo( this.waveAreaBounds.left + bottomReduction, bottomSurfaceY )
        .lineTo( this.waveAreaBounds.right - bottomReduction, bottomSurfaceY )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.centerY ).close();

      this.upNode.setMatrix( Matrix3.scaling( 1, rotationAmount + 1E-6 ) );
      this.upNode.centerY = this.sideSurfacePath.centerY;
      this.upNode.right = this.sideSurfacePath.right - 80;
    }
  } );
} );