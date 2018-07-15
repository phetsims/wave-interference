// Copyright 2018, University of Colorado Boulder

/**
 * For the sound scene, shows one speaker for each emitter, each with its own on/off button.
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
  const speakerImage = require( 'image!WAVE_INTERFERENCE/speaker.png' );

  class SoundEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     */
    constructor( model, waveAreaNode ) {
      super( model, model.soundScene, waveAreaNode, 42, new Image( speakerImage, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
        scale: 0.75
      } ) );
    }
  }

  return waveInterference.register( 'SoundEmitterNode', SoundEmitterNode );
} );