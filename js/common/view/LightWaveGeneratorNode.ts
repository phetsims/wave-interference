// Copyright 2018-2026, University of Colorado Boulder

/**
 * For the light scene, shows one laser pointer for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import LaserPointerNode, { LaserPointerNodeOptions } from '../../../../scenery-phet/js/LaserPointerNode.js';
import LightScene from '../model/LightScene.js';
import WaveAreaNode from './WaveAreaNode.js';
import WaveGeneratorNode from './WaveGeneratorNode.js';

// constants
const DEFAULT_OPTIONS: LaserPointerNodeOptions = {
  bodySize: new Dimension2( 80, 40 ),
  nozzleSize: new Dimension2( 10, 28 ),
  hasGlass: true,
  hasButton: false
};

class LightWaveGeneratorNode extends WaveGeneratorNode {

  // Shared laser pointer options for the light scene's wave generators (also reused for the scene icon).
  public static readonly DEFAULT_LASER_POINTER_OPTIONS = DEFAULT_OPTIONS;

  public constructor( lightScene: LightScene, waveAreaNode: WaveAreaNode, isPrimarySource: boolean ) {
    const laserPointerNode = new LaserPointerNode( lightScene.button1PressedProperty, combineOptions<LaserPointerNodeOptions>( {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 )
    }, DEFAULT_OPTIONS ) );
    super( lightScene, waveAreaNode, 70, isPrimarySource, laserPointerNode );
  }
}

export default LightWaveGeneratorNode;
