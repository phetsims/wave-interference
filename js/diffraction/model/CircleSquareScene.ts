// Copyright 2019-2026, University of Colorado Boulder

/**
 * This scene shows an aperture with an adjustable circle and square.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { millimetersUnit } from '../../../../scenery-phet/js/units/millimetersUnit.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import DiffractionScene from './DiffractionScene.js';

class CircleSquareScene extends DiffractionScene {
  public readonly circleDiameterProperty: NumberProperty; // mm
  public readonly squareWidthProperty: NumberProperty; // mm

  public constructor() {

    const circleDiameterProperty = new NumberProperty( 50 * 1E-3, {
      range: new Range( 40 * 1E-3, 150 * 1E-3 ),
      units: millimetersUnit
    } );

    const squareWidthProperty = new NumberProperty( 50 * 1E-3, {
      range: new Range( 40 * 1E-3, 150 * 1E-3 ),
      units: millimetersUnit
    } );
    super( [ circleDiameterProperty, squareWidthProperty ] );

    this.circleDiameterProperty = circleDiameterProperty;
    this.squareWidthProperty = squareWidthProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  public override renderToContext( context: CanvasRenderingContext2D ): void {

    const delta = 0.1;

    const circleCenterX = roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
    const circleCenterY = roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
    const circleRadius = this.circleDiameterProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

    const squareCenterX = roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
    const squareCenterY = roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
    const squareRadius = this.squareWidthProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

    context.beginPath();
    context.arc( circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2 );
    context.fill();

    context.fillRect( squareCenterX - squareRadius, squareCenterY - squareRadius, squareRadius * 2, squareRadius * 2 );
  }
}

export default CircleSquareScene;
