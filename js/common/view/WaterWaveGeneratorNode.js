// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each wave generator, each with its own on/off button. This implementation is
 * trivial and doesn't add state or methods, it simplifies readability at the call site, so we keep it as a convenience
 * constructor.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const WaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/WaveGeneratorNode' );
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  // how far the water drops have to fall, tuned so the water drop initially peeks out from the faucet (by less
  // than one frame)
  const FAUCET_VERTICAL_OFFSET = -110;

  class WaterWaveGeneratorNode extends WaveGeneratorNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( model, waveAreaNode, isPrimarySource ) {

      const faucetNode = new FaucetNode(
        // This value for maxFlowRate is irrelevant because we use our own faucet water emitting model,
        // but must be nonzero to prevent a divide by zero problem
        1,

        // Flow rate is managed by this simulation and not depicted by the FaucetNode
        new NumberProperty( 0 ),

        // Faucet is enabled but not interactive
        new BooleanProperty( true ), {
          interactiveProperty: new BooleanProperty( false ),

          // Adjusted based on the dimension of the faucet image to align with the horizontal water drop location.
          // The vertical offset is adjusted with FAUCET_VERTICAL_OFFSET
          x: WaveInterferenceUtils.getWaterDropX( model.waterScene.lattice.visibleBounds, waveAreaNode.bounds ),
          scale: 0.25,
          horizontalPipeLength: 1600, // Long enough that it still shows even for extreme aspect ratios

          // Overcome a flickering problems, see https://github.com/phetsims/wave-interference/issues/187
          rasterizeHorizontalPipeNode: true
        } );

      super( model, model.waterScene, waveAreaNode, 62, isPrimarySource, faucetNode, FAUCET_VERTICAL_OFFSET, -7, true );
    }
  }

  return waveInterference.register( 'WaterWaveGeneratorNode', WaterWaveGeneratorNode );
} );