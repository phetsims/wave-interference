// Copyright 2019-2020, University of Colorado Boulder

/**
 * Uses the model's renderToContext function to draw directly to the view canvas, so the aperture views are anti-aliased
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';

class SceneCanvasNode extends CanvasNode {

  /**
   * @param {Property.<DiffractionScene>} sceneProperty - the selected scene
   * @param {Object} [options]
   */
  constructor( sceneProperty, options ) {

    super( merge( {
      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: new Bounds2( 0, 0,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION
      )
    }, options ) );

    // @private
    this.sceneProperty = sceneProperty;
  }

  /**
   * Redraws the aperture
   * @param {CanvasRenderingContext2D} context
   * @public
   * @override
   */
  paintCanvas( context ) {
    context.save();

    // Fill the background
    context.fillStyle = 'black';
    context.fillRect( 0, 0, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION );

    // Draw the aperture
    context.fillStyle = 'white';
    this.sceneProperty.value.renderToContext( context );

    context.restore();
  }
}

waveInterference.register( 'SceneCanvasNode', SceneCanvasNode );
export default SceneCanvasNode;