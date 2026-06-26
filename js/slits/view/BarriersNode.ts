// Copyright 2018-2026, University of Colorado Boulder

/**
 * Renders the draggable barrier with one or two slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Scene from '../../common/model/Scene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import SlitsModel from '../model/SlitsModel.js';

// constants
const CORNER_RADIUS = 2;

// AccessibleSlider already composes InteractiveHighlighting (via AccessibleValueHandler -> Voicing), so the mouse/touch
// highlight is provided without mixing InteractiveHighlighting in again.
class BarriersNode extends AccessibleSlider( Node, 0 ) {
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

    // The barrier moves horizontally within 80% of the wave area; this is the same constraint the pointer DragListener
    // uses below. The keyboard slider operates on the x lattice coordinate.
    const erodedBounds = scene.lattice.visibleBounds.erodedX( scene.lattice.visibleBounds.width / 10 );

    // Bridges the AccessibleSlider (a single number) to the Vector2-valued barrierPositionProperty, whose x component
    // is the only meaningful degree of freedom.
    const barrierXProperty = new NumberProperty( scene.barrierPositionProperty.value.x );

    const barrierRange = new Range( erodedBounds.minX, erodedBounds.maxX );
    const soundPlayer = new ValueChangeSoundPlayer( barrierRange );
    let previousValue = barrierXProperty.value;

    super( combineOptions<AccessibleSliderOptions & NodeOptions>( {
      cursor: 'pointer',
      children: [ rectangleA, rectangleB, rectangleC ],

      // AccessibleSlider - keyboard control of the barrier's horizontal position. Steps are in lattice cells; the
      // barrier's effective position is rounded to a cell (see barrierLatticeCoordinateProperty), so values snap to
      // integers.
      valueProperty: barrierXProperty,
      enabledRangeProperty: new Property( barrierRange ),
      keyboardStep: 2,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 10,
      constrainValue: value => roundSymmetric( value ),
      drag: () => {
        soundPlayer.playSoundForValueChange( barrierXProperty.value, previousValue );
        previousValue = barrierXProperty.value;
      }
    } ) );

    this.rectangleA = rectangleA;
    this.rectangleB = rectangleB;
    this.rectangleC = rectangleC;

    // Keep the slider value and the Vector2 position in sync. Both terminal sets below resolve to equal values, so
    // there is no reentrant notification.
    scene.barrierPositionProperty.link( position => { barrierXProperty.value = position.x; } );
    barrierXProperty.link( x => {
      if ( scene.barrierPositionProperty.value.x !== x ) {
        scene.barrierPositionProperty.value = new Vector2( x, scene.barrierPositionProperty.value.y );
      }
    } );

    // Width of the barrier
    this.barrierWidth = scene.latticeToViewTransform!.modelToViewDeltaX( WaveInterferenceConstants.CALIBRATION_SCALE );

    this.addInputListener( new SoundDragListener( {
      mapPosition: modelPosition => {

        // Constrain to lie within 80% of the wave area
        return erodedBounds.closestPointTo( modelPosition );
      },

      // Use continuous value for drag handler
      positionProperty: scene.barrierPositionProperty,
      transform: scene.latticeToViewTransform
    } ) );

    // Draggable double-headed arrow beneath the barrier
    this.arrowNode = new ArrowNode( 0, 0, 56, 0, {
      doubleHead: true,
      fill: '#61af5e',
      headHeight: 18,
      headWidth: 18,
      tailWidth: 8
    } );
    this.addChild( this.arrowNode );

    const barrierTypeDynamicProperty = new DynamicProperty( model.sceneProperty, {

      // barrierTypeProperty is only created for plane-wave (slits) scenes, which are the only scenes used here.
      derive: ( scene: Scene ) => scene.barrierTypeProperty!,
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
    const barrierType = this.scene.barrierTypeProperty!.get();
    const scene = this.scene;
    const slitWidth = scene.slitWidthProperty.get();
    const slitSeparation = scene.slitSeparationProperty.get();

    // Only expose the keyboard slider when there is a barrier to position.
    this.accessibleVisible = barrierType !== 'noBarrier';

    // Barrier origin in view coordinates, sets the parent node position for compatibility with DragListener,
    // see https://github.com/phetsims/wave-interference/issues/75
    this.x = scene.latticeToViewTransform!.modelToViewX( scene.barrierLatticeCoordinateProperty.value );

    if ( barrierType === 'noBarrier' ) {

      // No need to add children
      this.rectangleA.visible = false;
      this.rectangleB.visible = false;
      this.rectangleC.visible = false;
      this.arrowNode.visible = false;
    }
    else {
      const waveAreaTop = this.waveAreaViewBounds.top;
      if ( barrierType === 'oneSlit' ) {

        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = false;
        this.arrowNode.visible = true;

        const slitWidthView = scene.modelViewTransform!.modelToViewDeltaY( slitWidth );
        const y1 = this.waveAreaViewBounds.centerY - slitWidthView / 2;
        const y2 = this.waveAreaViewBounds.centerY + slitWidthView / 2;
        this.rectangleA.setRect( 0, waveAreaTop, this.barrierWidth, y1 - waveAreaTop, CORNER_RADIUS, CORNER_RADIUS );
        this.rectangleB.setRect( 0, y2, this.barrierWidth, this.waveAreaViewBounds.bottom - y2, CORNER_RADIUS, CORNER_RADIUS );
        this.arrowNode.centerX = this.barrierWidth / 2;
        this.arrowNode.top = this.rectangleB.bottom + 2;
      }
      else if ( barrierType === 'twoSlits' ) {
        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = true;
        this.arrowNode.visible = true;

        const waveAreaWidth = scene.waveAreaWidth;
        const bottomOfTopBarrier = scene.modelViewTransform!
          .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 - slitWidth / 2 );
        const topOfCentralBarrier = scene.modelViewTransform!
          .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 + slitWidth / 2 );
        const bottomOfCentralBarrier = scene.modelViewTransform!
          .modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 - slitWidth / 2 );
        const topOfBottomBarrier = scene.modelViewTransform!
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

export default BarriersNode;
