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

  class CircleSquareScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty} - in nm
      this.circleDiameterProperty = new NumberProperty( 500, { // TODO: 500 duplicated many places
        range: new Range( 200, 1000 )
      } );

      // @public {NumberProperty} - in nm
      this.squareWidthProperty = new NumberProperty( 500, {
        range: new Range( 200, 1000 )
      } );

      this.properties = [ this.circleDiameterProperty, this.squareWidthProperty ];
    }

    /**
     * Render the aperture shape(s) to the canvas context.
     * @param {CanvasRenderingContext2D} context
     * @protected
     */
    renderToContext( context ) {

      const delta = 0.1;

      const circleCenterX = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
      const circleCenterY = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
      const circleRadius = this.circleDiameterProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      const squareCenterX = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const squareCenterY = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const squareRadius = this.squareWidthProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      // Blurring a bit eliminates more artifacts
      // context.filter = 'blur(0.75px)';
      context.beginPath();
      context.arc( circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2 );
      context.fill();

      context.fillRect( squareCenterX - squareRadius, squareCenterY - squareRadius, squareRadius * 2, squareRadius * 2 );
    }
  }

  return waveInterference.register( 'CircleSquareScene', CircleSquareScene );
} );