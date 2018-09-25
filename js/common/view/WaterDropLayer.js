// Copyright 2018, University of Colorado Boulder

/**
 * Shows the WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const WaterDropImage = require( 'WAVE_INTERFERENCE/common/view/WaterDropImage' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class WaterDropLayer extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {
      super();
      const modelViewTransform = ModelViewTransform2.createRectangleMapping( model.waterScene.getWaveAreaBounds(), waveAreaNodeBounds );

      // Compute the x-coordinate where the drop should be shown.
      const m = ModelViewTransform2.createRectangleMapping( model.lattice.visibleBounds, waveAreaNodeBounds );

      // Note this is nudged over 1/2 a cell so it will appear in the center of the cell rather than
      // at the left edge of the cell
      const CENTER_X = m.modelToViewX( WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE + 0.5 );

      // Preallocate Images that will be associated with different water drop instances.
      const MAX_DROPS = 4;
      const waterDropImages = _.times( MAX_DROPS, () => new WaterDropImage() );

      this.children = waterDropImages;
      this.mutate( options );

      const updateWaterDropNodes = () => {
        waterDropImages.forEach( dropNode => dropNode.setVisible( false ) );
        model.waterScene.waterDrops.forEach( ( waterDrop, i ) => {

          if ( i < waterDropImages.length ) {

            // Indicate which WaterDrop corresponds to this image so when the view goes underwater, the model can
            // be marked as absorbed
            waterDropImages[ i ].waterDrop = waterDrop;

            waterDropImages[ i ].visible = waterDrop.amplitude > 0 && !waterDrop.absorbed && waterDrop.startsOscillation;
            waterDropImages[ i ].setScaleMagnitude( Util.linear( 0, 8, 0.1, 0.3, waterDrop.amplitude ) );
            const dy = waterDrop.sign * modelViewTransform.modelToViewDeltaY( waterDrop.sourceSeparation / 2 );
            waterDropImages[ i ].center = new Vector2( CENTER_X, waveAreaNodeBounds.centerY - waterDrop.y + dy );
          }
        } );
      };

      // At the end of each model step, update all of the particles as a batch.
      const updateIfWaterScene = () => {
        if ( model.sceneProperty.value === model.waterScene ) {
          updateWaterDropNodes();
        }
      };
      model.stepEmitter.addListener( updateIfWaterScene );
      model.sceneProperty.link( updateIfWaterScene );

      // @private - for closure.  If any water drop went underwater, mark it as absorbed so it will no longer be shown.
      this.stepWaterDropLayer = waterSideViewNode => {
        for ( let dropNode of waterDropImages ) {
          if ( dropNode.visible ) {
            if ( model.rotationAmountProperty.value === 1.0 && dropNode.waterDrop && ( dropNode.top - 50 > waterSideViewNode.waterSideViewNodeTopY ) ) {
              dropNode.waterDrop.absorbed = true;
            }
          }
        }
      };
    }

    /**
     * Pass-through for the closure.
     * @param {WaterSideViewNode} waterSideViewNode
     * @public
     */
    step( waterSideViewNode ) {

      // if in side view and the drop is submerged, mark it as absorbed so it won't show any longer.
      this.stepWaterDropLayer( waterSideViewNode );
    }
  }

  return waveInterference.register( 'WaterDropLayer', WaterDropLayer );
} );