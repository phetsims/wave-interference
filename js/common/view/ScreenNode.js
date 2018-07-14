// Copyright 2017-2018, University of Colorado Boulder

/**
 * Renders the screen at right hand side of the wave area, showing the time-averaged intensity (for the light scene only).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  const CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;
  const CANVAS_WIDTH = 100;

  // This chooses the saturation point for the screen, as well as the "thinness" of the minima
  const BRIGHTNESS_SCALE_FACTOR = 7;

  class ScreenNode extends CanvasNode {

    /**
     * @param {Lattice} lattice
     * @param {IntensitySample} intensitySample
     * @param {Object} [options]
     */
    constructor( lattice, intensitySample, options ) {
      const latticeCanvasBounds = WaveInterferenceUtils.getCanvasBounds( lattice );
      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: new Bounds2( 0, 0, CANVAS_WIDTH, latticeCanvasBounds.height ),
        layerSplit: true // ensure we're on our own layer
      }, options );
      super( options );

      // @private
      this.lattice = lattice;

      // @private
      this.intensitySample = intensitySample;

      // @private
      this.baseColor = new Color( 'blue' );

      // Render into a sub-canvas which will be drawn into the rendering context at the right scale.
      // Use a single column of pixels, then stretch them to the right (since that is a constant)
      const w = 1;
      const h = this.lattice.height - this.lattice.dampY * 2;
      this.directCanvas = document.createElement( 'canvas' );
      this.directCanvas.width = w;
      this.directCanvas.height = h;
      this.directContext = this.directCanvas.getContext( '2d' );
      this.imageData = this.directContext.createImageData( w, h );

      // Invalidate paint when model indicates changes
      const invalidateSelfListener = this.invalidatePaint.bind( this );
      lattice.changedEmitter.addListener( invalidateSelfListener );

      // Show it at a 3d perspective, as if orthogonal to the wave view
      const shear = Matrix3.dirtyFromPool().setToAffine( 1, 0, 0, -0.5, 1, 0 );
      this.appendMatrix( shear );

      // After shearing, center on the LatticeNode.  Vertical offset determined empirically.
      this.translate( -CANVAS_WIDTH / 2, 0 );
    }

    /**
     * Convert the given point (in the local coordinate frame) to the corresponding i,j (integral) coordinates on the lattice.
     * @param {Vector2} point - point in the local coordinate frame
     * @returns {Vector2}
     */
    localPointToLatticePoint( point ) {
      return new Vector2( Math.floor( point.x / CELL_WIDTH ), Math.floor( point.y / CELL_WIDTH ) );
    }

    /**
     * Sets the color of the peaks of the wave.
     * @param {Color} color
     * @public
     */
    setBaseColor( color ) {
      this.baseColor = color;
      this.invalidatePaint();
    }

    /**
     * Draws into the canvas.  Note this logic must be kept in sync with the WebGL fragment shader and LatticeCanvasNode
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas( context ) {

      const intensityValues = this.intensitySample.getIntensityValues();

      let m = 0;
      const data = this.imageData.data;
      const dampY = this.lattice.dampY;
      const height = this.lattice.height;
      for ( let k = dampY; k < height - dampY; k++ ) {

        const intensity = intensityValues[ k - this.lattice.dampY ];
        let brightness = Util.linear( 0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT, 0, 1, intensity );
        brightness = Util.clamp( brightness * BRIGHTNESS_SCALE_FACTOR, 0, 1 );

        // Note this interpolation doesn't include the gamma factor that Color.blend does
        const r = this.baseColor.red * brightness;
        const g = this.baseColor.green * brightness;
        const b = this.baseColor.blue * brightness;

        const offset = 4 * m;
        data[ offset + 0 ] = r;
        data[ offset + 1 ] = g;
        data[ offset + 2 ] = b;
        data[ offset + 3 ] = 255; // Fully opaque
        m++;
      }
      this.directContext.putImageData( this.imageData, 0, 0 );

      // draw the sub-canvas to the rendering context at the appropriate scale
      context.save();
      context.transform( CELL_WIDTH * 10, 0, 0, CELL_WIDTH, 0, 0 );
      context.drawImage( this.directCanvas, 0, 0 );
      context.restore();
    }
  }

  return waveInterference.register( 'ScreenNode', ScreenNode );
} );