// Copyright 2019, University of Colorado Boulder

/**
 * Uses the model's renderToContext function to draw directly to the view canvas, so the aperture views are anti-aliased
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const merge = require( 'PHET_CORE/merge' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class SceneCanvasNode extends CanvasNode {

    /**
     * @param {Property.<DiffractionScene>} sceneProperty - the selected scene
     * @param {Object} [options]
     */
    constructor( sceneProperty, options ) {

      super( merge( {
        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: new Bounds2( 0, 0,
          WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION,
          WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION
        )
      }, options ) );

      // @private
      this.sceneProperty = sceneProperty;
    }

    /**
     * Redraws the aperture
     * @param {CanvasRenderingContext2D} context
     * @public
     * @override
     */
    paintCanvas( context ) {
      context.save();

      // Fill the background
      context.fillStyle = 'black';
      context.fillRect( 0, 0, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION, WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION );

      // Draw the aperture
      context.fillStyle = 'white';
      this.sceneProperty.value.renderToContext( context );

      context.restore();
    }
  }

  return waveInterference.register( 'SceneCanvasNode', SceneCanvasNode );
} );