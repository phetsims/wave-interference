// Copyright 2019-2022, University of Colorado Boulder

/**
 * This scene shows an aperture with an adjustable circle and square.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

class CircleSquareScene extends DiffractionScene {
  public readonly circleDiameterProperty: NumberProperty; // mm
  public readonly squareWidthProperty: NumberProperty; // mm

  public constructor() {

    const circleDiameterProperty = new NumberProperty( 50 * 1E-3, {
      range: new Range( 40 * 1E-3, 150 * 1E-3 ),
      units: 'mm'
    } );

    const squareWidthProperty = new NumberProperty( 50 * 1E-3, {
      range: new Range( 40 * 1E-3, 150 * 1E-3 ),
      units: 'mm'
    } );
    super( [ circleDiameterProperty, squareWidthProperty ] );

    this.circleDiameterProperty = circleDiameterProperty;
    this.squareWidthProperty = squareWidthProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  protected override renderToContext( context: CanvasRenderingContext2D ): void {

    const delta = 0.1;

    const circleCenterX = Utils.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
    const circleCenterY = Utils.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
    const circleRadius = this.circleDiameterProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

    const squareCenterX = Utils.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
    const squareCenterY = Utils.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
    const squareRadius = this.squareWidthProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

    context.beginPath();
    context.arc( circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2 );
    context.fill();

    context.fillRect( squareCenterX - squareRadius, squareCenterY - squareRadius, squareRadius * 2, squareRadius * 2 );
  }
}

waveInterference.register( 'CircleSquareScene', CircleSquareScene );
export default CircleSquareScene;