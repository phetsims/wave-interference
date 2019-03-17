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

      const heightProperty = new NumberProperty( 1000, {
        range: new Range( 0, 1000 )
      } );
      const rotationProperty = new NumberProperty( 0, {
        range: new Range( 0, Math.PI * 2 )
      } );
      super( [ heightProperty, rotationProperty ] );

      // @public {NumberProperty}
      this.heightProperty = heightProperty;

      // @public {NumberProperty}
      this.rotationProperty = rotationProperty;

      // Render to a canvas and sample points.  Using kite Shape.containsPoint on the SVG shape declaration was much too slow
      this.canvas = document.createElement( 'canvas' );
      this.canvas.width = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
      this.canvas.height = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
      this.context = this.canvas.getContext( '2d' );
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {
      assert && assert( matrix.getRowDimension() % 2 === 0, 'matrix should be even' );
      assert && assert( matrix.getColumnDimension() % 2 === 0, 'matrix should be even' );

      // clear canvas
      this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
      this.context.save();
      this.context.translate( 0, -wavingGirl256Image.height * 0.2 );
      this.context.translate( wavingGirl256Image.width / 2, wavingGirl256Image.height / 2 );
      this.context.rotate( this.rotationProperty.value );
      this.context.scale( 0.3 * scaleFactor, 0.3 * this.heightProperty.value / 1000 * scaleFactor );
      this.context.translate( -wavingGirl256Image.width / 2, -wavingGirl256Image.height / 2 );
      this.context.drawImage( wavingGirl256Image, 0, 0 );

      const canvasData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {

          const pixelIndex = y * canvasData.width + x;
          const arrayIndex = pixelIndex * 4;
          const a = canvasData.data[ arrayIndex + 3 ]; // R=0, G=1, B=2, A=3
          const contained = a > 0;

          // TODO: consider average over neighborhood -- if performance on iPad Air 2 is fast enough.

          matrix.set( y, x, contained ? 1 : 0 );
        }
      }
      this.context.restore();
    }
  }

  return waveInterference.register( 'WavingGirlScene', WavingGirlScene );
} );