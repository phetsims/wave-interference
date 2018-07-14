// Copyright 2018, University of Colorado Boulder

/**
 * Renders the draggable barrier with one or two slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
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

      /**
       * Creates one of the 3 recycled rectangles used for rendering the barriers.
       */
      const createRectangle = function() {
        return new Rectangle( 0, 0, 0, 0, 2, 2, {
          fill: '#f3d99b',
          stroke: 'black',
          lineWidth: 1
        } );
      };

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
      this.cellWidth = ModelViewTransform2.createRectangleMapping( this.model.lattice.getVisibleBounds(), viewBounds ).modelToViewDeltaX( 1 );

      // @private - Convert from model coordinates to view coordinates
      this.modelViewTransform = ModelViewTransform2.createRectangleMapping( this.scene.getWaveAreaBounds(), viewBounds );

      this.addInputListener( new DragListener( {
        applyOffset: false,
        locationProperty: scene.barrierLocationProperty,
        transform: this.modelViewTransform
      } ) );

      // Update shapes when the model parameters change
      const update = this.update.bind( this );
      model.barrierTypeProperty.link( update );
      scene.barrierLocationProperty.link( update );
      scene.slitWidthProperty.link( update );
      scene.slitSeparationProperty.link( update );
    }

    /**
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update() {

      const barrierType = this.model.barrierTypeProperty.get();
      const scene = this.scene;
      const slitWidth = scene.slitWidthProperty.get();
      const slitSeparation = scene.slitSeparationProperty.get();

      // Barrier origin in view coordinates
      const x = this.modelViewTransform.modelToViewX( scene.getBarrierLocation() );

      if ( barrierType === BarrierTypeEnum.NO_BARRIER ) {

        // No need to add children
        this.rectangleA.visible = false;
        this.rectangleB.visible = false;
        this.rectangleC.visible = false;
      }
      else if ( barrierType === BarrierTypeEnum.ONE_SLIT ) {

        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = false;

        const slitWidthView = this.modelViewTransform.modelToViewDeltaY( slitWidth );
        const y1 = this.waveAreaViewBounds.centerY - slitWidthView / 2;
        const y2 = this.waveAreaViewBounds.centerY + slitWidthView / 2;
        this.rectangleA.setRect( x, this.waveAreaViewBounds.top, this.cellWidth, y1 - this.waveAreaViewBounds.top, 2, 2 );
        this.rectangleB.setRect( x, y2, this.cellWidth, this.waveAreaViewBounds.bottom - y2, 2, 2 );
      }
      else if ( barrierType === BarrierTypeEnum.TWO_SLITS ) {
        this.rectangleA.visible = true;
        this.rectangleB.visible = true;
        this.rectangleC.visible = true;

        const waveAreaWidth = scene.waveAreaWidth;
        const bottomOfTopBarrier = this.modelViewTransform.modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 - slitWidth / 2 );
        const topOfCentralBarrier = this.modelViewTransform.modelToViewY( waveAreaWidth / 2 - slitSeparation / 2 + slitWidth / 2 );
        const bottomOfCentralBarrier = this.modelViewTransform.modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 - slitWidth / 2 );
        const topOfBottomBarrier = this.modelViewTransform.modelToViewY( waveAreaWidth / 2 + slitSeparation / 2 + slitWidth / 2 );
        this.rectangleA.setRect( x, this.waveAreaViewBounds.top, this.cellWidth, Math.max( 0, bottomOfTopBarrier - this.waveAreaViewBounds.top ), 2, 2 );
        this.rectangleB.setRect( x, topOfCentralBarrier, this.cellWidth, Math.max( bottomOfCentralBarrier - topOfCentralBarrier, 0 ), 2, 2 );
        this.rectangleC.setRect( x, topOfBottomBarrier, this.cellWidth, Math.max( this.waveAreaViewBounds.bottom - topOfBottomBarrier ), 2, 2 );
      }
    }
  }

  return waveInterference.register( 'BarriersNode', BarriersNode );
} );