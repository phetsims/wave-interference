// Copyright 2019-2026, University of Colorado Boulder

/**
 * Uses the model's renderToContext function to draw directly to the view canvas, so the aperture views are anti-aliased
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CanvasNode, { CanvasNodeOptions } from '../../../../scenery/js/nodes/CanvasNode.js';
import DiffractionScene from '../model/DiffractionScene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';

type SelfOptions = EmptySelfOptions;
type SceneCanvasNodeOptions = SelfOptions & CanvasNodeOptions;

class SceneCanvasNode extends CanvasNode {

  private readonly sceneProperty: Property<DiffractionScene>;

  public constructor( sceneProperty: Property<DiffractionScene>, providedOptions?: SceneCanvasNodeOptions ) {

    const options = optionize<SceneCanvasNodeOptions, SelfOptions, CanvasNodeOptions>()( {

      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: new Bounds2( 0, 0,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION
      )
    }, providedOptions );

    super( options );

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

    // This view intentionally invokes the model's public renderToContext method to draw the aperture.
    this.sceneProperty.value.renderToContext( context );

    context.restore();
  }
}

export default SceneCanvasNode;
