// Copyright 2018, University of Colorado Boulder

/**
 * For the light scene, shows one laser pointer for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function LightEmitterNode( model, waveAreaNode ) {
    EmitterNode.call( this, model, model.lightScene, waveAreaNode, 70, new LaserPointerNode( model.button1PressedProperty, {
      bodySize: new Dimension2( 80, 40 ),
      nozzleSize: new Dimension2( 10, 28 ),
      hasGlass: true,
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      hasButton: false
    } ) );
  }

  waveInterference.register( 'LightEmitterNode', LightEmitterNode );

  return inherit( EmitterNode, LightEmitterNode );
} );