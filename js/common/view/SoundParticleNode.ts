// Copyright 2019-2022, University of Colorado Boulder

/**
 * Renders a sound particle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';

class SoundParticleNode extends ShadedSphereNode {

  public constructor( options?: ShadedSphereNodeOptions ) {
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
  public static createForCanvas( color: Color, callback: ( canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number ) => void ): void {
    return new SoundParticleNode( { mainColor: color } ).toCanvas( callback );
  }
}

waveInterference.register( 'SoundParticleNode', SoundParticleNode );
export default SoundParticleNode;