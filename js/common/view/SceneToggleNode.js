// Copyright 2018, University of Colorado Boulder

/**
 * A ToggleNode that shows something different for each scene.
 * TODO: Apply this class elsewhere
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
     * @param {function} sceneToNode
     * @param {Object} [options]
     */
    constructor( model, sceneToNode, options ) {
      super( [
        { value: model.waterScene, node: sceneToNode( model.waterScene ) },
        { value: model.soundScene, node: sceneToNode( model.soundScene ) },
        { value: model.lightScene, node: sceneToNode( model.lightScene ) }
      ], model.sceneProperty, options );
    }
  }

  return waveInterference.register( 'SceneToggleNode', SceneToggleNode );
} );