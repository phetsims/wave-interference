// Copyright 2018-2026, University of Colorado Boulder

/**
 * Shows the WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { linear } from '../../../../dot/js/util/linear.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaterScene from '../model/WaterScene.js';
import WaterDropImage from './WaterDropImage.js';
import WaterSideViewNode from './WaterSideViewNode.js';

class WaterDropLayer extends Node {

  // Marks any water drop that has gone underwater as absorbed so it will no longer be shown.
  private readonly stepWaterDropLayer: ( waterSideViewNode: WaterSideViewNode ) => void;

  public constructor( model: WavesModel, waveAreaNodeBounds: Bounds2, options?: NodeOptions ) {
    super();

    // WaterDropLayer is only created for screens that have a water scene.
    // @ts-expect-error - model.waterScene is assigned dynamically and is not typed on WavesModel
    const waterScene: WaterScene = model.waterScene;
    const waterDropX = waterScene.getWaterDropX();

    // Preallocate Images that will be associated with different water drop instances.
    const MAX_DROPS = 4;
    const waterDropNodes = _.times( MAX_DROPS, () => new WaterDropImage() );

    assert && assert( !options || !options.children, 'children overwritten in WaterDropLayer' );
    this.children = waterDropNodes;
    this.mutate( options );

    const updateWaterDropNodes = () => {
      waterDropNodes.forEach( waterDropNode => waterDropNode.setVisible( false ) );
      waterScene.waterDrops.forEach( ( waterDrop, i ) => {

        if ( i < waterDropNodes.length ) {

          // Indicate which WaterDrop corresponds to this image so when the view goes underwater, the model can
          // be marked as absorbed
          waterDropNodes[ i ].waterDrop = waterDrop;

          waterDropNodes[ i ].visible = waterDrop.amplitude > 0 && !waterDrop.absorbed && waterDrop.startsOscillation;
          waterDropNodes[ i ].setScaleMagnitude( linear( 0, 8, 0.1, 0.3, waterDrop.amplitude ) );
          const dy = waterDrop.sign * waterScene.modelViewTransform!.modelToViewDeltaY( waterDrop.sourceSeparation / 2 );
          waterDropNodes[ i ].center = new Vector2( waterDropX, waveAreaNodeBounds.centerY - waterDrop.y + dy );
        }
      } );
    };

    // At the end of each model step, update all of the particles as a batch.
    const update = () => {
      if ( model.sceneProperty.value === waterScene ) {
        updateWaterDropNodes();
      }
    };

    model.stepEmitter.addListener( update );
    model.sceneProperty.link( update );

    // If any water drop went underwater, mark it as absorbed so it will no longer be shown.
    this.stepWaterDropLayer = waterSideViewNode => {
      for ( let i = 0; i < waterDropNodes.length; i++ ) {
        const dropNode = waterDropNodes[ i ];
        if ( dropNode.visible ) {

          const fullyRotated = model.rotationAmountProperty.value === 1.0;

          // @ts-expect-error - waterSideViewNodeTopY is private on WaterSideViewNode
          const beneathSurface = dropNode.top - 50 > waterSideViewNode.waterSideViewNodeTopY;
          if ( fullyRotated && dropNode.waterDrop && beneathSurface ) {
            dropNode.waterDrop.absorbed = true;
          }
        }
      }
    };
  }

  /**
   * Pass-through for the closure. If in side view and a drop is submerged, mark it as absorbed so it won't show
   * any longer.
   *
   * @param waterSideViewNode - the node whose surface y-coordinate determines whether a drop is underwater
   */
  public step( waterSideViewNode: WaterSideViewNode ): void {

    // if in side view and the drop is submerged, mark it as absorbed so it won't show any longer.
    this.stepWaterDropLayer( waterSideViewNode );
  }
}

export default WaterDropLayer;
