// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a single rectangular aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class RectangleScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.widthProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 400, 8000 )
      } );

      // @public {NumberProperty}
      this.heightProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 400, 8000 )
      } );

      this.properties = [ this.widthProperty, this.heightProperty ];
    }

    renderToContext( scaleFactor ) {
      const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
      const columnRadius = Util.roundSymmetric( this.widthProperty.value * modelToMatrixScale * scaleFactor / 2 );
      const rowRadius = Util.roundSymmetric( this.heightProperty.value * modelToMatrixScale * scaleFactor / 2 );

      // Blurring a bit eliminates more artifacts
      this.context.filter = 'blur(0.5px)';
      this.context.fillStyle = 'white';
      this.context.fillRect(
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - columnRadius,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - rowRadius,
        columnRadius * 2, rowRadius * 2
      );
    }
  }

  return waveInterference.register( 'RectangleScene', RectangleScene );
} );