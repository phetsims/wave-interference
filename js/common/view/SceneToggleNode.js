// Copyright 2018, University of Colorado Boulder

/**
 * A ToggleNode that shows something different for each scene.  All SceneToggleNodes in this sim exist for the lifetime
 * of the sim and doesn't require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ToggleNode = require( 'SUN/ToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SceneToggleNode extends ToggleNode {

    /**
     * @param {WavesModel} model
     * @param {function} sceneToNode given a {Scene}, create a corresponding {Node}
     * @param {Object} [options]
     */
    constructor( model, sceneToNode, options ) {
      const toElement = scene => ( { value: scene, node: sceneToNode( scene ) } );
      super( model.sceneProperty, model.scenes.map( toElement ), options );
    }
  }

  return waveInterference.register( 'SceneToggleNode', SceneToggleNode );
} );