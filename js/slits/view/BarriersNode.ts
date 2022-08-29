// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Renders the draggable barrier with one or two slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { DragListener, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Scene from '../../common/model/Scene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import SlitsModel from '../model/SlitsModel.js';

// constants
const CORNER_RADIUS = 2;

class BarriersNode extends Node {
  private readonly rectangleA: Rectangle;
  private readonly rectangleB: Rectangle;
  private readonly rectangleC: Rectangle;
  private readonly barrierWidth: number;
  private readonly arrowNode: ArrowNode;

  public constructor( private readonly model: SlitsModel,
                      private readonly scene: Scene,
                      private readonly waveAreaViewBounds: Bounds2 ) {

    /**
     * Creates one of the 3 recycled rectangles used for rendering the barriers.
     */
    const createRectangle = () => new Rectangle( 0, 0, 0, 0, {
      fill: '#f3d99b',
      stroke: 'black',
      lineWidth: 1,
      cornerRadius: CORNER_RADIUS
    } );

    const rectangleA = createRectangle();
    const rectangleB = createRectangle();
    const rectangleC = createRectangle();

    super( {
      cursor: 'pointer',
      children: [ rectangleA, rectangleB, rectangleC ]
    } );

    this.rectangleA = rectangleA;
    this.rectangleB = rectangleB;
    this.rectangleC = rectangleC;

    // @private - Width of the barrier
    this.barrierWidth = scene.latticeToViewTransform!.modelToViewDeltaX( WaveInterferenceConstants.CALIBRATION_SCALE );

    this.addInputListener( new DragListener( {
      mapPosition: modelPosition => {

        // Constrain to lie within 80% of the wave area
        const erodedBounds = scene.lattice.visibleBounds.erodedX( scene.lattice.visibleBounds.width / 10 );
        return erodedBounds.closestPointTo( modelPosition );
      },

      // Use continuous value for drag handler
      positionProperty: scene.barrierPositionProperty,
      transform: scene.latticeToViewTransform
    } ) );

    // @private - draggable double-headed arrow beneath the barrier
    this.arrowNode = new ArrowNode( 0, 0, 56, 0, {
      doubleHead: true,
      fill: '#61af5e',
      headHeight: 18,
      headWidth: 18,
      tailWidth: 8
    } );
    this.addChild( this.arrowNode );

    const barrierTypeDynamicProperty = new DynamicProperty( model.sceneProperty, {
      derive: 'barrierTypeProperty',
      bidirectional: true
    } );

    // Update shapes when the model parameters change
    const update = this.update.bind( this );
    barrierTypeDynamicProperty.link( update );
    scene.barrierLatticeCoordinateProperty.link( update );
    scene.slitWidthProperty.link( update );
    scene.slitSeparationProperty.link( update );
    model.resetEmitter.addListener( update );
  }

  /**
   * Update the shapes and text when the rotationAmount has changed
   */
  private update(): void {
    const barrierType = this.scene.barrierTypeProperty.get();
    const scene = this.scene;
    const slitWidth = scene.slitWidthProperty.get();
    const slitSeparation = scene.slitSeparationProperty.get();

    // Barrier origin in view coordinates, sets the parent node position for compatibility with DragListener,
    // see https://github.com/phetsims/wave-interference/issues/75
    this.x = scene.latticeToViewTransform.modelToViewX( scene.barrierLatticeCoordinateProperty.value );

    if ( barrierType === Scene.BarrierType.NO_BARRIER ) {

      // No need to add children
      this.rectangleA.visible = false;
      this.rectangleB.visible = false;
      this.rectangleC.visible = false;
      this.arrowNode.visible = false;
    }
    else {
      const waveAreaTop = this.waveAreaViewBounds.top;
      if ( barrierType === Scene.BarrierType.ONE_SLIT ) {

        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = false;
        this.arrowNode.visible = true;

        const slitWidthView = scene.modelViewTransform.modelToViewDeltaY( slitWidth );
        const y1 = this.waveAreaViewBounds.centerY - slitWidthView / 2;
        const y2 = this.waveAreaViewBounds.centerY + slitWidthView / 2;
        this.rectangleA.setRect( 0, waveAreaTop, this.barrierWidth, y1 - waveAreaTop, CORNER_RADIUS, CORNER_RADIUS );
        this.rectangleB.setRect( 0, y2, this.barrierWidth, this.waveAreaViewBounds.bottom - y2, CORNER_RADIUS, CORNER_RADIUS );
        this.arrowNode.centerX = this.barrierWidth / 2;
        this.arrowNode.top = this.rectangleB.bottom + 2;
      }
      else if ( barrierType === Scene.BarrierType.TWO_SLITS ) {
        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = true;
        this.arrowNode.visible = true;

        const waveAreaWidth = scene.waveAreaWidth;
        const bottomOfTopBarrier = scene.modelViewTransform
          .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 - slitWidth / 2 );
        const topOfCentralBarrier = scene.modelViewTransform
          .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 + slitWidth / 2 );
        const bottomOfCentralBarrier = scene.modelViewTransform
          .modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 - slitWidth / 2 );
        const topOfBottomBarrier = scene.modelViewTransform
          .modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 + slitWidth / 2 );
        this.rectangleA.setRect(
          0, waveAreaTop,
          this.barrierWidth, Math.max( 0, bottomOfTopBarrier - waveAreaTop ),
          CORNER_RADIUS, CORNER_RADIUS
        );
        this.rectangleB.setRect(
          0, topOfCentralBarrier,
          this.barrierWidth, Math.max( bottomOfCentralBarrier - topOfCentralBarrier, 0 ),
          CORNER_RADIUS, CORNER_RADIUS
        );
        this.rectangleC.setRect(
          0, topOfBottomBarrier,
          this.barrierWidth, Math.max( this.waveAreaViewBounds.bottom - topOfBottomBarrier ),
          CORNER_RADIUS, CORNER_RADIUS
        );
        this.arrowNode.centerX = this.barrierWidth / 2;
        this.arrowNode.top = this.rectangleC.bottom + 2;
      }
    }
  }
}

waveInterference.register( 'BarriersNode', BarriersNode );
export default BarriersNode;
