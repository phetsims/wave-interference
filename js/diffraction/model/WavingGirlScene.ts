// Copyright 2019-2022, University of Colorado Boulder

/**
 * This scene shows a the iconic "waving girl" aperture shape.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import waving_girl_aperture_png from '../../../images/waving_girl_aperture_png.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

class WavingGirlScene extends DiffractionScene {

  // the height of the aperture in mm
  public readonly heightProperty: NumberProperty;

  // the angle of rotation in degrees
  public readonly rotationProperty: NumberProperty;

  public constructor() {

    const heightProperty = new NumberProperty( 100 * 1E-3, {
      range: new Range( 40 * 1E-3, 400 * 1E-3 ),
      units: 'mm'
    } );
    const rotationProperty = new NumberProperty( 0, {
      range: new Range( 0, 360 ),
      units: '\u00B0' // degrees
    } );
    super( [ heightProperty, rotationProperty ] );

    this.heightProperty = heightProperty;
    this.rotationProperty = rotationProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  protected override renderToContext( context: CanvasRenderingContext2D ): void {
    const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
    context.translate( waving_girl_aperture_png.width / 2, waving_girl_aperture_png.height * 0.1 );
    context.translate( waving_girl_aperture_png.width / 2, waving_girl_aperture_png.height / 2 );
    context.rotate( this.rotationProperty.value / 360 * 2 * Math.PI );
    const scale = modelToMatrixScale / waving_girl_aperture_png.height * this.heightProperty.value;
    context.scale( scale, scale );
    context.translate( -waving_girl_aperture_png.width / 2, -waving_girl_aperture_png.height / 2 );
    context.drawImage( waving_girl_aperture_png, 0, 0 );
  }
}

waveInterference.register( 'WavingGirlScene', WavingGirlScene );
export default WavingGirlScene;