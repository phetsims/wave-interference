// Copyright 2019, University of Colorado Boulder

/**
 * At the time of writing, Scenery WebGLBlock doesn't support clipArea.  Hence we developed this workaround which
 * applies CSS clipping to the scenery "webgl-container".  See https://github.com/phetsims/wave-interference/issues/322
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Util = require( 'DOT/Util' );//eslint-disable-line
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const SceneryWebGLClippingRegion = {

    /**
     * Creates a listener which can be called frequently (every frame) which clips the scenery WebGL container bounds
     * using CSS.
     *
     * @param model
     * @param node
     * @returns {Function}
     * @public
     */
    createListener( model, node, bounds ) {
      let lastClipPath = null;

      return () => {

        // Guard against extra garbage
        if ( model.sceneProperty.value === model.soundScene ) {
          const globalBounds = node.localToGlobalBounds( bounds );

          // This clips all of the webgl-containers.  If we start using WebGL elsewhere in the simulation, this will
          // be problematic.  If WebGL usage is constrained to the wave area, this could be OK.
          const webglContainers = document.getElementsByClassName( 'webgl-container' );
          for ( let i = 0; i < webglContainers.length; i++ ) {
            const element = webglContainers[ i ];
            const left = Util.roundSymmetric( globalBounds.left );
            const right = Util.roundSymmetric( globalBounds.right );
            const top = Util.roundSymmetric( globalBounds.top );
            const bottom = Util.roundSymmetric( globalBounds.bottom );
            const clipPath = `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`;
            if ( lastClipPath !== clipPath ) {
              element.style.clipPath = clipPath;
              element.style.webkitClipPath = clipPath; // iOS support
              lastClipPath = clipPath;
            }
          }
        }
      };
    }
  };


  return waveInterference.register( 'SceneryWebGLClippingRegion', SceneryWebGLClippingRegion );
} );