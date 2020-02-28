// Copyright 2018-2020, University of Colorado Boulder

/**
 * A ToggleNode that shows something different for each scene.  All SceneToggleNodes in this sim exist for the lifetime
 * of the sim and doesn't require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ToggleNode from '../../../../sun/js/ToggleNode.js';
import waveInterference from '../../waveInterference.js';

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

waveInterference.register( 'SceneToggleNode', SceneToggleNode );
export default SceneToggleNode;