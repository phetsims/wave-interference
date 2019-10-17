// Copyright 2019, University of Colorado Boulder

/**
 * Renders a sound particle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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

  return waveInterference.register( 'SoundParticleNode', SoundParticleNode );
} );