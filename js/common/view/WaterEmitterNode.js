// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );

  class WaterEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     */
    constructor( model, waveAreaNode ) {
      super( model, model.waterScene, waveAreaNode, 62, new Image( hoseImage, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
        scale: 0.75
      } ) );
    }
  }

  return waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );
} );