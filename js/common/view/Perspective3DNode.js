// Copyright 2018-2019, University of Colorado Boulder

/**
 * Shows the partially rotated wave view in a pseudo-3D view.  Ported from RotationGlyph.java
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Easing = require( 'TWIXT/Easing' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const topString = require( 'string!WAVE_INTERFERENCE/top' );

  class Perspective3DNode extends Node {

    /**
     * @param {Bounds2} waveAreaBounds
     * @param {NumberProperty} rotationAmountProperty
     * @param {DerivedProperty.<boolean>} isRotatingProperty
     */
    constructor( waveAreaBounds, rotationAmountProperty, isRotatingProperty ) {

      // depicts the top face
      const topFacePath = new Path( null, {
        stroke: 'black',
        lineWidth: 4,
        lineJoin: 'round'
      } );

      // depicts the side face (when the user selects "side view")
      const sideFacePath = new Path( null, {
        stroke: 'black',
        lineWidth: 4,
        lineJoin: 'round'
      } );

      // shows the up arrow
      const upNode = new HBox( {
        children: [
          new WaveInterferenceText( topString, { fontSize: 32 } ),
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
      super( { children: [ topFacePath, sideFacePath, upNode ] } );

      // @private
      this.waveAreaBounds = waveAreaBounds;
      this.rotationAmountProperty = rotationAmountProperty;
      this.isRotatingProperty = isRotatingProperty;
      this.topFacePath = topFacePath;
      this.sideFacePath = sideFacePath;
      this.upNode = upNode;

      // Update the shapes and text when the rotationAmount has changed
      rotationAmountProperty.link( this.update.bind( this ) );
    }

    /**
     * Sets the top face color, when the scene changes.
     * @param {Color|string} color - the top face color
     * @public
     */
    setTopFaceColor( color ) {
      this.topFacePath.fill = color;
    }

    /**
     * Sets the side face color, when the scene changes.
     * @param {Color|string} color - the side face color
     * @public
     */
    setSideFaceColor( color ) {
      this.sideFacePath.fill = color;
    }

    /**
     * Creates a shape for the top or side Face, at the correct perspective angle.
     * @param {number} reduction - amount to reduce the width at the furthest point from the center
     * @param {number} y - vertical coordinate of the Face
     * @returns {Shape}
     * @private
     */
    createFaceShape( reduction, y ) {
      return new Shape()
        .moveTo( this.waveAreaBounds.left, this.waveAreaBounds.centerY )
        .lineTo( this.waveAreaBounds.left + reduction, y )
        .lineTo( this.waveAreaBounds.right - reduction, y )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.centerY ).close();
    }

    /**
     * Update the shapes and text when the rotationAmount has changed
     * @private
     */
    update() {

      // Apply easing to make the transition look visually nicer
      const rotationAmount = Easing.CUBIC_IN_OUT.value( this.rotationAmountProperty.get() );
      const bounds = this.waveAreaBounds;
      const perspectiveWidth = bounds.width * 0.2;

      const topFaceTopY = Util.linear( 0, 1, bounds.top, bounds.centerY, rotationAmount );
      const topReduction = Util.linear( 0, 1, 0, perspectiveWidth, rotationAmount );
      const sideFaceBottomY = Util.linear( 0, 1, bounds.centerY, bounds.bottom, rotationAmount );
      const bottomReduction = Util.linear( 0, 1, perspectiveWidth, 0, rotationAmount );

      this.topFacePath.shape = this.createFaceShape( topReduction, topFaceTopY );
      this.sideFacePath.shape = this.createFaceShape( bottomReduction, sideFaceBottomY );

      // Only show the 3d perspective view while rotating
      this.topFacePath.visible = this.isRotatingProperty.get();
      this.sideFacePath.visible = this.isRotatingProperty.get();

      // Only show the "top" indicator while rotating, but not while it is exactly at 0 degrees
      this.upNode.visible = this.isRotatingProperty.get() && rotationAmount !== 0;

      // Position the arrow and text
      if ( this.upNode.visible ) {
        this.upNode.setMatrix( Matrix3.scaling( 1, rotationAmount ) );
        this.upNode.centerY = this.sideFacePath.shape.bounds.centerY;
        this.upNode.right = this.sideFacePath.shape.bounds.right - 80;
      }
    }
  }

  return waveInterference.register( 'Perspective3DNode', Perspective3DNode );
} );