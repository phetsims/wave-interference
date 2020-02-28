// Copyright 2019-2020, University of Colorado Boulder

/**
 * This scene shows a the iconic "waving girl" aperture shape.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import wavingGirlApertureImage from '../../../images/waving_girl_aperture_png.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

class WavingGirlScene extends DiffractionScene {

  constructor() {

    const heightProperty = new NumberProperty( 100 * 1E-3, {
      range: new Range( 40 * 1E-3, 400 * 1E-3 ),
      units: 'mm'
    } );
    const rotationProperty = new NumberProperty( 0, {
      range: new Range( 0, 360 ),
      units: 'degrees'
    } );
    super( [ heightProperty, rotationProperty ] );

    // @public {NumberProperty} - the height of the aperture in mm
    this.heightProperty = heightProperty;

    // @public {NumberProperty} - the angle of rotation in degrees
    this.rotationProperty = rotationProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   * @param {CanvasRenderingContext2D} context
   * @protected
   * @override
   */
  renderToContext( context ) {
    const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
    context.translate( wavingGirlApertureImage.width / 2, wavingGirlApertureImage.height * 0.1 );
    context.translate( wavingGirlApertureImage.width / 2, wavingGirlApertureImage.height / 2 );
    context.rotate( this.rotationProperty.value / 360 * 2 * Math.PI );
    const scale = modelToMatrixScale / wavingGirlApertureImage.height * this.heightProperty.value;
    context.scale( scale, scale );
    context.translate( -wavingGirlApertureImage.width / 2, -wavingGirlApertureImage.height / 2 );
    context.drawImage( wavingGirlApertureImage, 0, 0 );
  }
}

waveInterference.register( 'WavingGirlScene', WavingGirlScene );
export default WavingGirlScene;