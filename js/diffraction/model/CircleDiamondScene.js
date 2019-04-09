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

  class CircleDiamondScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.circleDiameterProperty = new NumberProperty( 500, { // TODO: 500 duplicated many places
        range: new Range( 200, 1000 )
      } );

      // @public {NumberProperty}
      this.diamondSideLengthProperty = new NumberProperty( 500, {
        range: new Range( 200, 1000 )
      } );

      this.properties = [ this.circleDiameterProperty, this.diamondSideLengthProperty ];
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

      const diamondCenterX = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const diamondCenterY = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const diamondRadius = this.diamondSideLengthProperty.value / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      // Blurring a bit eliminates more artifacts
      // context.filter = 'blur(0.75px)';
      context.beginPath();
      context.arc( circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2 );
      context.fill();

      context.translate( 150, 200 );
      context.rotate( Math.PI / 4 );
      context.translate( -150, -200 );
      context.fillRect( diamondCenterX - diamondRadius, diamondCenterY - diamondRadius, diamondRadius * 2, diamondRadius * 2 );
    }
  }

  return waveInterference.register( 'CircleDiamondScene', CircleDiamondScene );
} );