// Copyright 2018-2022, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each wave generator, each with its own on/off button. This implementation is
 * trivial and doesn't add state or methods, it simplifies readability at the call site, so we keep it as a convenience
 * constructor.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import waveInterference from '../../waveInterference.js';
import WaterScene from '../model/WaterScene.js';
import WaveAreaNode from './WaveAreaNode.js';
import WaveGeneratorNode from './WaveGeneratorNode.js';

// constants
// how far the water drops have to fall, tuned so the water drop initially peeks out from the faucet (by less
// than one frame)
const FAUCET_VERTICAL_OFFSET = -110;

class WaterWaveGeneratorNode extends WaveGeneratorNode {

  public constructor( waterScene: WaterScene, waveAreaNode: WaveAreaNode, isPrimarySource: boolean ) {

    const faucetNode = new FaucetNode(
      // This value for maxFlowRate is irrelevant because we use our own faucet water emitting model,
      // but must be nonzero to prevent a divide by zero problem
      1,

      // Flow rate is managed by this simulation and not depicted by the FaucetNode
      new NumberProperty( 0 ),

      // Faucet is enabled but not interactive
      new BooleanProperty( true ), {
        interactiveProperty: new BooleanProperty( false ),

        // Adjusted based on the dimension of the faucet image to align with the horizontal water drop position.
        // The vertical offset is adjusted with FAUCET_VERTICAL_OFFSET
        x: waterScene.getWaterDropX(),
        scale: 0.25,
        horizontalPipeLength: 1600, // Long enough that it still shows even for extreme aspect ratios

        // Overcome a flickering problems, see https://github.com/phetsims/wave-interference/issues/187
        rasterizeHorizontalPipeNode: true
      } );

    super( waterScene, waveAreaNode, 62, isPrimarySource, faucetNode, FAUCET_VERTICAL_OFFSET, -7, true );
  }
}

waveInterference.register( 'WaterWaveGeneratorNode', WaterWaveGeneratorNode );
export default WaterWaveGeneratorNode;
