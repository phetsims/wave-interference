// Copyright 2019-2022, University of Colorado Boulder

/**
 * This scene shows a single elliptical aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

class EllipseScene extends DiffractionScene {

  public readonly diameterProperty: NumberProperty; // mm
  public readonly eccentricityProperty: NumberProperty; // unitless

  public constructor() {

    const diameterProperty = new NumberProperty( 100E-3, {
      range: new Range( 40E-3, 400E-3 ),
      units: 'mm'
    } );

    const eccentricityProperty = new NumberProperty( 0, {
      range: new Range( 0, 0.99 )
    } );

    super( [ diameterProperty, eccentricityProperty ] );

    this.diameterProperty = diameterProperty;
    this.eccentricityProperty = eccentricityProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  protected override renderToContext( context: CanvasRenderingContext2D ): void {
    const eccentricity = this.eccentricityProperty.value;
    const diameter = this.diameterProperty.value;
    const rx = diameter / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
    const ry = Math.sqrt( rx * rx * ( 1 - eccentricity * eccentricity ) );

    context.beginPath();

    if ( context.ellipse ) {
      context.ellipse(
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2,
        rx, ry, 0, 0, Math.PI * 2
      );
    }
    else {

      // context.ellipse is not supported on IE11, see https://github.com/phetsims/wave-interference/issues/424
      // In that case, render as a scaled circle
      context.save();
      context.translate( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 );
      context.scale( rx, ry );
      context.arc( 0, 0, 1, 0, Math.PI * 2 );
      context.restore();
    }

    context.fill();
  }
}

waveInterference.register( 'EllipseScene', EllipseScene );
export default EllipseScene;