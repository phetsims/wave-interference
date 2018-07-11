// Copyright 2018, University of Colorado Boulder

/**
 * For the sound scene, shows one speaker for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  var speakerImage = require( 'image!WAVE_INTERFERENCE/speaker.png' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function SoundEmitterNode( model, waveAreaNode ) {
    EmitterNode.call( this, model, model.soundScene, waveAreaNode, 42, new Image( speakerImage, {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      scale: 0.75
    } ) );
  }

  waveInterference.register( 'SoundEmitterNode', SoundEmitterNode );

  return inherit( EmitterNode, SoundEmitterNode );
} );