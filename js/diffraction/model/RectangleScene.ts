// Copyright 2019-2022, University of Colorado Boulder

/**
 * This scene shows a single rectangular aperture with an adjustable width and height.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

class RectangleScene extends DiffractionScene {

  public readonly widthProperty: NumberProperty; // mm
  public readonly heightProperty: NumberProperty; // mm

  public constructor() {

    const widthProperty = new NumberProperty( 100E-3, {
      range: new Range( 40E-3, 400E-3 ),
      units: 'mm'
    } );
    const heightProperty = new NumberProperty( 100E-3, {
      range: new Range( 40E-3, 400E-3 ),
      units: 'mm'
    } );
    super( [ widthProperty, heightProperty ] );

    this.widthProperty = widthProperty;
    this.heightProperty = heightProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  protected override renderToContext( context: CanvasRenderingContext2D ): void {
    const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
    const columnRadius = Utils.roundSymmetric( this.widthProperty.value * modelToMatrixScale / 2 );
    const rowRadius = Utils.roundSymmetric( this.heightProperty.value * modelToMatrixScale / 2 );

    context.fillRect(
      WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - columnRadius,
      WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - rowRadius,
      columnRadius * 2, rowRadius * 2
    );
  }
}

waveInterference.register( 'RectangleScene', RectangleScene );
export default RectangleScene;