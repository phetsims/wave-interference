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
      this.circleDiameterProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 0, 1000 )
      } );

      // @public {NumberProperty}
      this.diamondDiameterProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 0, 1000 )
      } );

      this.properties = [ this.circleDiameterProperty, this.diamondDiameterProperty ];
    }

    renderToContext( scaleFactor ) {

      // TODO: separate the objects based on scaleFactor?
      // TODO: move scale factor to parent?
      const delta = 0.1 * scaleFactor;

      const circleCenterX = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
      const circleCenterY = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 - delta ) );
      const circleRadius = this.circleDiameterProperty.value / 2 * scaleFactor * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      const diamondCenterX = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const diamondCenterY = Util.roundSymmetric( WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION * ( 1 / 2 + delta ) );
      const diamondRadius = this.diamondDiameterProperty.value / 2 * scaleFactor * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      // Blurring a bit eliminates more artifacts
      // this.context.filter = 'blur(0.75px)';
      this.context.beginPath();
      this.context.arc( circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2 );
      this.context.fill();

      this.context.translate( 150, 200 );
      this.context.rotate( Math.PI / 4 );
      this.context.translate( -150, -200 );
      this.context.fillRect( diamondCenterX - diamondRadius, diamondCenterY - diamondRadius, diamondRadius * 2, diamondRadius * 2 );
    }
  }

  return waveInterference.register( 'CircleDiamondScene', CircleDiamondScene );
} );