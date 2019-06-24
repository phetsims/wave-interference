// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a the iconic "waving girl" aperture shape.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // images
  const wavingGirlApertureImage = require( 'image!WAVE_INTERFERENCE/waving_girl_aperture.png' );

  class WavingGirlScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty} - the height of the aperture in mm
      this.heightProperty = new NumberProperty( 100 * 1E-3, {
        range: new Range( 40 * 1E-3, 400 * 1E-3 )
      } );

      // @public {NumberProperty} - the angle of rotation in degrees
      this.rotationProperty = new NumberProperty( 0, {
        range: new Range( 0, 360 )
      } );

      this.properties = [ this.heightProperty, this.rotationProperty ];
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

  return waveInterference.register( 'WavingGirlScene', WavingGirlScene );
} );