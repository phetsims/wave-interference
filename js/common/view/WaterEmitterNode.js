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
  const inherit = require( 'PHET_CORE/inherit' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function WaterEmitterNode( model, waveAreaNode ) {
    EmitterNode.call( this, model, model.waterScene, waveAreaNode, 62, new Image( hoseImage, {
      rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
      scale: 0.75
    } ) );
  }

  waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );

  return inherit( EmitterNode, WaterEmitterNode );
} );