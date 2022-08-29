// Copyright 2019-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Uses the model's renderToContext function to draw directly to the view canvas, so the aperture views are anti-aliased
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { CanvasNode } from '../../../../scenery/js/imports.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';

class SceneCanvasNode extends CanvasNode {

  public constructor( sceneProperty, options ) {

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
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {
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