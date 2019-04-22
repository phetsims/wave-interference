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

      // @public {NumberProperty} - in mm
      this.widthProperty = new NumberProperty( 100E-3, {
        range: new Range( 40E-3, 400E-3 )
      } );

      // @public {NumberProperty} - in mm
      this.heightProperty = new NumberProperty( 100E-3, {
        range: new Range( 40E-3, 400E-3 )
      } );

      this.properties = [ this.widthProperty, this.heightProperty ];
    }

    /**
     * Render the aperture shape(s) to the canvas context.
     * @param {CanvasRenderingContext2D} context
     * @protected
     */
    renderToContext( context ) {
      const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
      const columnRadius = Util.roundSymmetric( this.widthProperty.value * modelToMatrixScale / 2 );
      const rowRadius = Util.roundSymmetric( this.heightProperty.value * modelToMatrixScale / 2 );

      // Blurring a bit eliminates more artifacts
      context.filter = 'blur(0.5px)';
      context.fillRect(
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - columnRadius,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2 - rowRadius,
        columnRadius * 2, rowRadius * 2
      );
    }
  }

  return waveInterference.register( 'RectangleScene', RectangleScene );
} );