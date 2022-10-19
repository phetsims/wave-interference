// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * For the light scene, shows one laser pointer for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import waveInterference from '../../waveInterference.js';
import LightScene from '../model/LightScene.js';
import WaveGeneratorNode from './WaveGeneratorNode.js';
import WaveAreaNode from './WaveAreaNode.js';

// constants
const DEFAULT_OPTIONS = {
  bodySize: new Dimension2( 80, 40 ),
  nozzleSize: new Dimension2( 10, 28 ),
  hasGlass: true,
  hasButton: false
};

class LightWaveGeneratorNode extends WaveGeneratorNode {

  public constructor( lightScene: LightScene, waveAreaNode: WaveAreaNode, isPrimarySource: boolean ) {
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
LightWaveGeneratorNode.DEFAULT_NODE_OPTIONS = DEFAULT_OPTIONS;

waveInterference.register( 'LightWaveGeneratorNode', LightWaveGeneratorNode );
export default LightWaveGeneratorNode;