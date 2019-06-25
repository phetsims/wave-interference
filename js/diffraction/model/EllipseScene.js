// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a single elliptical aperture.
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

  class EllipseScene extends DiffractionScene {
    constructor() {

      const diameterProperty = new NumberProperty( 100E-3, {
        range: new Range( 40E-3, 400E-3 ),
        units: 'mm'
      } );

      const eccentricityProperty = new NumberProperty( 0, {
        range: new Range( 0, 0.99 )
      } );

      super( [ diameterProperty, eccentricityProperty ] );

      // @public {NumberProperty} - in mm
      this.diameterProperty = diameterProperty;

      // @public {NumberProperty} - unitless
      this.eccentricityProperty = eccentricityProperty;
    }

    /**
     * Render the aperture shape(s) to the canvas context.
     * @param {CanvasRenderingContext2D} context
     * @protected
     * @override
     */
    renderToContext( context ) {
      const eccentricity = this.eccentricityProperty.value;
      const diameter = this.diameterProperty.value;
      const rx = diameter / 2 * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;
      const ry = Math.sqrt( rx * rx * ( 1 - eccentricity * eccentricity ) );

      context.beginPath();
      context.ellipse(
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2,
        WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION / 2,
        rx, ry, 0, 0, Math.PI * 2
      );
      context.fill();
    }
  }

  return waveInterference.register( 'EllipseScene', EllipseScene );
} );