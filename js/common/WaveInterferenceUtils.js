// Copyright 2018, University of Colorado Boulder

/**
 * Utilities for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;
  const POINT_SOURCE = WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE -
                       WaveInterferenceConstants.LATTICE_PADDING;

  class WaveInterferenceUtils {

    /**
     * Gets a Shape representing the top of the water in water side view from left to right, also used for the chart.
     * @param {number[]} array - reused to avoid allocations
     * @param {Lattice} lattice
     * @param {Bounds2} waveAreaBounds
     * @param {number} dx
     * @param {number} dy
     * @returns {Shape}
     * @public
     */
    static getWaterSideShape( array, lattice, waveAreaBounds, dx, dy ) {
      lattice.getCenterLineValues( array );
      const shape = new Shape();

      for ( let i = 0; i < array.length; i++ ) {
        const value = ( i === POINT_SOURCE ) ? ( array[ i ] + 3 * array[ i - 1 ] + 3 * array[ i + 1 ] ) / 7 :
                      array[ i ];

        // Map the center of the cell to the same point on the graph,
        // see https://github.com/phetsims/wave-interference/issues/143
        const x = Util.linear( -0.5, array.length - 1 + 0.5, waveAreaBounds.left, waveAreaBounds.right, i ) + dx;
        const y = WaveInterferenceUtils.getWaterSideY( waveAreaBounds, value ) + dy;
        shape.lineTo( x, y );
      }
      return shape;
    }

    /**
     * Finds the y-value at a specific point on the side wave.  This is used to see if a water drop has entered the
     * water in the side view.
     * @param {Bounds2} waveAreaBounds
     * @param {number} waveValue
     * @returns {number}
     * @public
     */
    static getWaterSideY( waveAreaBounds, waveValue ) {

      // Typical values for the propagating wave can be between -5 and 5 (though values can exceed this range very close
      // to the oscillating cell.  We choose to map a value of 0 to the center of the wave area, and the max (5) to the
      // desired distance amplitude.  A wave value of 0 appears in the center of the wave area. A value of 5 appears 80
      // screen view coordinates above the center line.
      return Util.linear( 0, 5, waveAreaBounds.centerY, waveAreaBounds.centerY - 80, waveValue );
    }

    /**
     * Gets the bounds to use for a canvas, in view coordinates
     * @param {Lattice} lattice
     * @returns {Bounds2}
     * @public
     * @static
     */
    static getCanvasBounds( lattice ) {
      return new Bounds2(
        0, 0,
        ( lattice.width - lattice.dampX * 2 ) * CELL_WIDTH, ( lattice.height - lattice.dampY * 2 ) * CELL_WIDTH
      );
    }

    /**
     * Convert a value to femto.
     * @param {number} value
     * @returns {number}
     * @public
     */
    static toFemto( value ) {
      return value * WaveInterferenceConstants.FEMTO;
    }

    /**
     * Convert a value from femto.
     * @param {number} value
     * @returns {number}
     * @public
     */
    static fromFemto( value ) {
      return value / WaveInterferenceConstants.FEMTO;
    }

    /**
     * Gets the horizontal coordinate where water drops come out--aligned with the oscillation cell.
     * @param {Bounds2} waterSceneLatticeBounds - visible bounds for water scene lattice
     * @param {Bounds2} waveAreaViewBounds
     * @returns {number}
     */
    static getWaterDropX( waterSceneLatticeBounds, waveAreaViewBounds ) {

      // Compute the x-coordinate where the drop should be shown.
      const transform = ModelViewTransform2.createRectangleMapping( waterSceneLatticeBounds, waveAreaViewBounds );

      // Note this is nudged over 1/2 a cell so it will appear in the center of the cell rather than
      // at the left edge of the cell.  See also WaveInterferenceUtils.getWaterSideShape.
      return transform.modelToViewX( WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE + 0.5 );
    }

    /**
     * At the default size, the text should "nestle" into the slider.  But when the text is too small, it must be spaced
     * further away.  See https://github.com/phetsims/wave-interference/issues/194
     * @param {Node} titleNode
     * @returns {number}
     * @public
     */
    static getSliderTitleSpacing( titleNode ) {

      const tallTextHeight = 17;
      const shortTextHeight = 4;

      const tallTextSpacing = -2;
      const shortTextSpacing = 5;

      return Util.linear( tallTextHeight, shortTextHeight, tallTextSpacing, shortTextSpacing, titleNode.height );
    }
  }

  return waveInterference.register( 'WaveInterferenceUtils', WaveInterferenceUtils );
} );