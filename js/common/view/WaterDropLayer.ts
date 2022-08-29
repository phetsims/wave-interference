// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Shows the WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Node } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaterDropImage from './WaterDropImage.js';

class WaterDropLayer extends Node {

  public constructor( model, waveAreaNodeBounds, options ) {
    super();

    const waterDropX = model.waterScene.getWaterDropX();

    // Preallocate Images that will be associated with different water drop instances.
    const MAX_DROPS = 4;
    const waterDropNodes = _.times( MAX_DROPS, () => new WaterDropImage() );

    assert && assert( !options || !options.children, 'children overwritten in WaterDropLayer' );
    this.children = waterDropNodes;
    this.mutate( options );

    const updateWaterDropNodes = () => {
      waterDropNodes.forEach( waterDropNode => waterDropNode.setVisible( false ) );
      model.waterScene.waterDrops.forEach( ( waterDrop, i ) => {

        if ( i < waterDropNodes.length ) {

          // Indicate which WaterDrop corresponds to this image so when the view goes underwater, the model can
          // be marked as absorbed
          waterDropNodes[ i ].waterDrop = waterDrop;

          waterDropNodes[ i ].visible = waterDrop.amplitude > 0 && !waterDrop.absorbed && waterDrop.startsOscillation;
          waterDropNodes[ i ].setScaleMagnitude( Utils.linear( 0, 8, 0.1, 0.3, waterDrop.amplitude ) );
          const dy = waterDrop.sign * model.waterScene.modelViewTransform.modelToViewDeltaY( waterDrop.sourceSeparation / 2 );
          waterDropNodes[ i ].center = new Vector2( waterDropX, waveAreaNodeBounds.centerY - waterDrop.y + dy );
        }
      } );
    };

    // At the end of each model step, update all of the particles as a batch.
    const update = () => {
      if ( model.sceneProperty.value === model.waterScene ) {
        updateWaterDropNodes();
      }
    };
    model.stepEmitter.addListener( update );
    model.sceneProperty.link( update );

    // @private - for closure.  If any water drop went underwater, mark it as absorbed so it will no longer be shown.
    this.stepWaterDropLayer = waterSideViewNode => {
      for ( let i = 0; i < waterDropNodes.length; i++ ) {
        const dropNode = waterDropNodes[ i ];
        if ( dropNode.visible ) {
          const fullyRotated = model.rotationAmountProperty.value === 1.0;
          const beneathSurface = dropNode.top - 50 > waterSideViewNode.waterSideViewNodeTopY;
          if ( fullyRotated && dropNode.waterDrop && beneathSurface ) {
            dropNode.waterDrop.absorbed = true;
          }
        }
      }
    };
  }

  /**
   * Pass-through for the closure.
   */
  public step( waterSideViewNode ): void {

    // if in side view and the drop is submerged, mark it as absorbed so it won't show any longer.
    this.stepWaterDropLayer( waterSideViewNode );
  }
}

waveInterference.register( 'WaterDropLayer', WaterDropLayer );
export default WaterDropLayer;