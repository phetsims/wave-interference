// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Shows the partially rotated wave view in a pseudo-3D view.  Ported from RotationGlyph.java
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { HBox, Node, Path } from '../../../../scenery/js/imports.js';
import Easing from '../../../../twixt/js/Easing.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const topString = WaveInterferenceStrings.top;

class Perspective3DNode extends Node {

  public constructor( waveAreaBounds: Bounds2, rotationAmountProperty: TReadOnlyProperty<number>, isRotatingProperty: TReadOnlyProperty<boolean> ) {

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
   * @param color - the top face color
   */
  public setTopFaceColor( color: Color ): void {
    this.topFacePath.fill = color;
  }

  /**
   * Sets the side face color, when the scene changes.
   * @param color - the side face color
   */
  public setSideFaceColor( color: Color ): void {
    this.sideFacePath.fill = color;
  }

  /**
   * Creates a shape for the top or side Face, at the correct perspective angle.
   * @param reduction - amount to reduce the width at the furthest point from the center
   * @param y - vertical coordinate of the Face
   */
  private createFaceShape( reduction: number, y: number ): Shape {
    return new Shape()
      .moveTo( this.waveAreaBounds.left, this.waveAreaBounds.centerY )
      .lineTo( this.waveAreaBounds.left + reduction, y )
      .lineTo( this.waveAreaBounds.right - reduction, y )
      .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.centerY ).close();
  }

  /**
   * Update the shapes and text when the rotationAmount has changed
   */
  private update(): void {

    // Apply easing to make the transition look visually nicer
    const rotationAmount = Easing.CUBIC_IN_OUT.value( this.rotationAmountProperty.get() );
    const bounds = this.waveAreaBounds;
    const perspectiveWidth = bounds.width * 0.2;

    const topFaceTopY = Utils.linear( 0, 1, bounds.top, bounds.centerY, rotationAmount );
    const topReduction = Utils.linear( 0, 1, 0, perspectiveWidth, rotationAmount );
    const sideFaceBottomY = Utils.linear( 0, 1, bounds.centerY, bounds.bottom, rotationAmount );
    const bottomReduction = Utils.linear( 0, 1, perspectiveWidth, 0, rotationAmount );

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

waveInterference.register( 'Perspective3DNode', Perspective3DNode );
export default Perspective3DNode;