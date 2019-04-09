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
  const wavingGirl256Image = require( 'image!WAVE_INTERFERENCE/waving_girl_256.png' );

  class WavingGirlScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.heightProperty = new NumberProperty( 1000, {
        range: new Range( 500, 2500 ) // nm
      } );

      // @public {NumberProperty}
      this.rotationProperty = new NumberProperty( 0, {
        range: new Range( 0, 360 ) // degrees
      } );

      this.properties = [ this.heightProperty, this.rotationProperty ];
    }

    /**
     * Render the aperture shape(s) to the canvas context.
     * @param {CanvasRenderingContext2D} context
     * @protected
     */
    renderToContext( context ) {

      const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      context.translate( 0, -wavingGirl256Image.height * 0.2 );
      context.translate( wavingGirl256Image.width / 2, wavingGirl256Image.height / 2 );
      context.rotate( this.rotationProperty.value / 360 * 2 * Math.PI );
      const scale = modelToMatrixScale / wavingGirl256Image.height * 1000;
      context.scale( scale, scale * this.heightProperty.value / 1000 );
      context.translate( -wavingGirl256Image.width / 2, -wavingGirl256Image.height / 2 );
      context.drawImage( wavingGirl256Image, 0, 0 );
    }
  }

  return waveInterference.register( 'WavingGirlScene', WavingGirlScene );
} );