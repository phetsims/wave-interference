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

  class WaterDropLayer extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {
      super();
      const modelViewTransform = ModelViewTransform2.createRectangleMapping( model.soundScene.getWaveAreaBounds(), waveAreaNodeBounds );

      var dropNodes = [];
      for ( let i = 0; i < 100; i++ ) {
        dropNodes.push( new ShadedSphereNode( 10, {
          x: modelViewTransform.modelToViewX( 14 ),
          y: modelViewTransform.modelToViewX( 100 ),
          mainColor: 'blue'
        } ) );
      }

      this.children = dropNodes;
      this.mutate( options );

      const updateWaterDropNodes = () => {
        dropNodes.forEach( dropNode => dropNode.setVisible( false ) );
        model.waterScene.waterDrops.forEach( ( waterDrop, i ) => {

          if ( i < dropNodes.length ) {
            dropNodes[ i ].visible = waterDrop.amplitude > 0;
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
    }
  }

  return waveInterference.register( 'WaterDropLayer', WaterDropLayer );
} );