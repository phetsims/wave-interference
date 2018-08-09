// Copyright 2018, University of Colorado Boulder

/**
 * A ToggleNode that shows something different for each scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ToggleNode = require( 'SUN/ToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SceneToggleNode extends ToggleNode {

    /**
     * @param {WavesScreenModel} model
     * @param {function} sceneToNode given a {Scene}, create a corresponding {Node}
     * @param {Object} [options]
     */
    constructor( model, sceneToNode, options ) {
      var toElement = scene => ( { value: scene, node: sceneToNode( scene ) } );
      super( [ model.waterScene, model.soundScene, model.lightScene ].map( toElement ), model.sceneProperty, options );
    }
  }

  return waveInterference.register( 'SceneToggleNode', SceneToggleNode );
} );