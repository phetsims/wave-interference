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
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Util = require( 'DOT/Util' );
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
      const modelViewTransform = ModelViewTransform2.createRectangleMapping( model.soundScene.getWaveAreaBounds(), waveAreaNodeBounds );

      const dropNodes = [];
      const MAX_DROPS = 4;
      for ( let i = 0; i < MAX_DROPS; i++ ) {
        dropNodes.push( new ShadedSphereNode( 10, {
          x: modelViewTransform.modelToViewX( 10 ),
          y: modelViewTransform.modelToViewX( 100 ),
          mainColor: WaveInterferenceConstants.WATER_SIDE_COLOR
        } ) );
      }

      this.children = dropNodes;
      this.mutate( options );

      const updateWaterDropNodes = () => {
        dropNodes.forEach( dropNode => dropNode.setVisible( false ) );
        model.waterScene.waterDrops.forEach( ( waterDrop, i ) => {

          if ( i < dropNodes.length ) {
            dropNodes[ i ].waterDrop = waterDrop; // TODO: hack alert
            dropNodes[ i ].visible = waterDrop.amplitude > 0 && !waterDrop.absorbed;
            dropNodes[ i ].setScaleMagnitude( Util.linear( 0, 8, 0.5, 3, waterDrop.amplitude ) );
            dropNodes[ i ].centerY = waveAreaNodeBounds.centerY - waterDrop.y;
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

      // @private - for closure
      this.stepWaterDropLayer = waterSideViewNode => {
        for ( let dropNode of dropNodes ) {
          if ( dropNode.visible ) {
            if ( model.rotationAmountProperty.value === 1.0 && dropNode.waterDrop && ( dropNode.top - 50 > waterSideViewNode.topY ) ) {
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