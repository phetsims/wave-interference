// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );

  // constants
  const FAUCET_VERTICAL_OFFSET = -100; // how far the water drops have to fall

  class WaterEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( model, waveAreaNode, isPrimarySource ) {
      super( model, model.waterScene, waveAreaNode, 62, isPrimarySource, new Image( hoseImage, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
        scale: 0.75
      } ), FAUCET_VERTICAL_OFFSET );
    }
  }

  return waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );
} );