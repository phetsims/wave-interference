// Copyright 2019-2020, University of Colorado Boulder

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
   * @param {Object} [options]
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
   * @param {ColorDef} color
   * @param {function} callback, see Node.toCanvas for signature
   * @returns {HTMLCanvasElement}
   */
  static createForCanvas( color, callback ) {
    return new SoundParticleNode( { mainColor: color } ).toCanvas( callback );
  }
}

waveInterference.register( 'SoundParticleNode', SoundParticleNode );
export default SoundParticleNode;