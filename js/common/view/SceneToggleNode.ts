// Copyright 2018-2022, University of Colorado Boulder

/**
 * A ToggleNode that shows something different for each scene.  All SceneToggleNodes in this sim exist for the lifetime
 * of the sim and doesn't require disposal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ToggleNode, { ToggleNodeOptions } from '../../../../sun/js/ToggleNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../../waves/model/WavesModel.js';
import Scene from '../model/Scene.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class SceneToggleNode extends ToggleNode<Scene> {

  public constructor( model: WavesModel, sceneToNode: ( scene: Scene ) => Node, options?: ToggleNodeOptions ) {
    const toElement = ( scene: Scene ) => ( { value: scene, createNode: ( tandem: Tandem ) => sceneToNode( scene ) } );
    super( model.sceneProperty, model.scenes.map( toElement ), options );
  }
}

waveInterference.register( 'SceneToggleNode', SceneToggleNode );
export default SceneToggleNode;