// Copyright 2018-2019, University of Colorado Boulder

/**
 * For the light scene, shows one laser pointer for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const LightScene = require( 'WAVE_INTERFERENCE/common/model/LightScene' );
  const merge = require( 'PHET_CORE/merge' );
  const WaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/WaveGeneratorNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const DEFAULT_OPTIONS = {
    bodySize: new Dimension2( 80, 40 ),
    nozzleSize: new Dimension2( 10, 28 ),
    hasGlass: true,
    hasButton: false
  };

  class LightWaveGeneratorNode extends WaveGeneratorNode {

    /**
     * @param {LightScene} lightScene
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( lightScene, waveAreaNode, isPrimarySource ) {
      assert && assert( lightScene instanceof LightScene, 'lightScene should be an instance of SoundScene' );
      const laserPointerNode = new LaserPointerNode( lightScene.button1PressedProperty, merge( {
        rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 )
      }, DEFAULT_OPTIONS ) );
      super( lightScene, waveAreaNode, 70, isPrimarySource, laserPointerNode );
    }
  }

  /**
   * @static
   * @public
   */
  LightWaveGeneratorNode.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

  return waveInterference.register( 'LightWaveGeneratorNode', LightWaveGeneratorNode );
} );