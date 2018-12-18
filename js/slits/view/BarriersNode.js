// Copyright 2018, University of Colorado Boulder

/**
 * Renders the draggable barrier with one or two slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SlitsScreenModel = require( 'WAVE_INTERFERENCE/slits/model/SlitsScreenModel' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class BarriersNode extends Node {

    /**
     * @param {SlitsScreenModel} model
     * @param {Scene} scene
     * @param {Bounds2} viewBounds
     */
    constructor( model, scene, viewBounds ) {

      assert && assert( model instanceof SlitsScreenModel );

      //REVIEW move duplicated cornerRadius constructor args to options.cornerRadius
      /**
       * Creates one of the 3 recycled rectangles used for rendering the barriers.
       */
      const createRectangle = () => new Rectangle( 0, 0, 0, 0, 2, 2, {
        fill: '#f3d99b',
        stroke: 'black',
        lineWidth: 1
      } );

      const rectangleA = createRectangle();
      const rectangleB = createRectangle();
      const rectangleC = createRectangle();

      super( {
        cursor: 'pointer',
        children: [ rectangleA, rectangleB, rectangleC ]
      } );

      // @private
      this.waveAreaViewBounds = viewBounds;

      // @private
      this.model = model;

      // @private
      this.scene = scene;

      // @private - create and reuse rectangles
      this.rectangleA = rectangleA;
      this.rectangleB = rectangleB;
      this.rectangleC = rectangleC;

      // @private - View width for one cell
      this.cellWidth = ModelViewTransform2.createRectangleMapping( scene.lattice.visibleBounds, viewBounds )
        .modelToViewDeltaX( 1 );

      // @private - Convert from model coordinates to view coordinates
      this.modelViewTransform = ModelViewTransform2.createRectangleMapping(
        this.scene.getWaveAreaBounds(),
        viewBounds
      );

      var latticeBounds = new Bounds2( 0, 0, 1, 1 );
      var modelBounds = scene.modelToLatticeTransform.viewToModelBounds( latticeBounds );
      var tempViewBounds = this.modelViewTransform.modelToViewBounds( modelBounds );

      //REVIEW missing visibility annotation
      this.latticeToViewTransform = ModelViewTransform2.createRectangleMapping( latticeBounds, tempViewBounds );

      this.addInputListener( new DragListener( {
        mapLocation: modelPosition => {

          // Constrain to lie within 80% of the wave area
          const erodedBounds = scene.lattice.visibleBounds.erodedX( scene.lattice.visibleBounds.width / 10 );
          return erodedBounds.closestPointTo( modelPosition );
        },

        // Use continuous value for drag handler
        locationProperty: scene.barrierLocationProperty,
        transform: this.latticeToViewTransform
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
     * @private
     */
    update() {
      const barrierType = this.scene.barrierTypeProperty.get();
      const scene = this.scene;
      const slitWidth = scene.slitWidthProperty.get();
      const slitSeparation = scene.slitSeparationProperty.get();

      // Barrier origin in view coordinates, sets the parent node location for compatibility with DragListener,
      // see https://github.com/phetsims/wave-interference/issues/75
      this.x = this.latticeToViewTransform.modelToViewX( scene.barrierLatticeCoordinateProperty.value );

      if ( barrierType === BarrierTypeEnum.NO_BARRIER ) {

        // No need to add children
        this.rectangleA.visible = false;
        this.rectangleB.visible = false;
        this.rectangleC.visible = false;
        this.arrowNode.visible = false;
      }
      else {
        const waveAreaTop = this.waveAreaViewBounds.top;
        if ( barrierType === BarrierTypeEnum.ONE_SLIT ) {

          this.rectangleA.visible = true;
          this.rectangleB.visible = true;
          this.rectangleC.visible = false;
          this.arrowNode.visible = true;

          const slitWidthView = this.modelViewTransform.modelToViewDeltaY( slitWidth );
          const y1 = this.waveAreaViewBounds.centerY - slitWidthView / 2;
          const y2 = this.waveAreaViewBounds.centerY + slitWidthView / 2;
          this.rectangleA.setRect( 0, waveAreaTop, this.cellWidth, y1 - waveAreaTop, 2, 2 );
          this.rectangleB.setRect( 0, y2, this.cellWidth, this.waveAreaViewBounds.bottom - y2, 2, 2 );
          this.arrowNode.centerX = this.cellWidth / 2;
          this.arrowNode.top = this.rectangleB.bottom + 2;
        }
        else if ( barrierType === BarrierTypeEnum.TWO_SLITS ) {
          this.rectangleA.visible = true;
          this.rectangleB.visible = true;
          this.rectangleC.visible = true;
          this.arrowNode.visible = true;

          const waveAreaWidth = scene.waveAreaWidth;
          const bottomOfTopBarrier = this.modelViewTransform
            .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 - slitWidth / 2 );
          const topOfCentralBarrier = this.modelViewTransform
            .modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 + slitWidth / 2 );
          const bottomOfCentralBarrier = this.modelViewTransform
            .modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 - slitWidth / 2 );
          const topOfBottomBarrier = this.modelViewTransform
            .modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 + slitWidth / 2 );
          this.rectangleA.setRect(
            0, waveAreaTop,
            this.cellWidth, Math.max( 0, bottomOfTopBarrier - waveAreaTop ),
            2, 2
          );
          this.rectangleB.setRect(
            0, topOfCentralBarrier,
            this.cellWidth, Math.max( bottomOfCentralBarrier - topOfCentralBarrier, 0 ),
            2, 2
          );
          this.rectangleC.setRect(
            0, topOfBottomBarrier,
            this.cellWidth, Math.max( this.waveAreaViewBounds.bottom - topOfBottomBarrier ),
            2, 2
          );
          this.arrowNode.centerX = this.cellWidth / 2;
          this.arrowNode.top = this.rectangleC.bottom + 2;
        }
      }
    }
  }

  return waveInterference.register( 'BarriersNode', BarriersNode );
} );