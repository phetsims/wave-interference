// Copyright 2019-2020, University of Colorado Boulder
// @ts-nocheck
/**
 * Renders a sound particle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import waveInterference from '../../waveInterference.js';

class SoundParticleNode extends ShadedSphereNode {

  /**
   * @param [options]
   */
  constructor( options ) {
    options = merge( {
      stroke: 'black',
      scale: 2
    }, options );
    super( 10, options );
  }

  /**
   * Create an image of a SoundParticleNode for the given color.
   * @param color
   * @param callback, see Node.toCanvas for signature
   */
  public static createForCanvas( color, callback ): HTMLCanvasElement {
    return new SoundParticleNode( { mainColor: color } ).toCanvas( callback );
  }
}

waveInterference.register( 'SoundParticleNode', SoundParticleNode );
export default SoundParticleNode;