// Copyright 2017-2018, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  const CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;

  class LatticeCanvasNode extends CanvasNode {

    /**
     * @param {Lattice} lattice
     * @param {Object} [options]
     */
    constructor( lattice, options ) {

      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: WaveInterferenceUtils.getCanvasBounds( lattice ),
        layerSplit: true // ensure we're on our own layer
      }, options );

      super( options );

      // @private
      this.lattice = lattice;

      // @private
      this.baseColor = new Color( 'blue' );

      // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light source
      this.vacuumColor = null;

      // Render into a sub-canvas which will be drawn into the rendering context at the right scale.
      const w = this.lattice.width - this.lattice.dampX * 2;
      const h = this.lattice.height - this.lattice.dampY * 2;
      this.directCanvas = document.createElement( 'canvas' );
      this.directCanvas.width = w;
      this.directCanvas.height = h;
      this.directContext = this.directCanvas.getContext( '2d' );
      this.imageData = this.directContext.createImageData( w, h );

      // Invalidate paint when model indicates changes
      const invalidateSelfListener = this.invalidatePaint.bind( this );
      lattice.changedEmitter.addListener( invalidateSelfListener );
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
     * Draws into the canvas.  Note this logic must be kept in sync with the WebGL fragment shader and ScreenNode.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas( context ) {

      let m = 0;
      const data = this.imageData.data;
      const dampX = this.lattice.dampX;
      const dampY = this.lattice.dampY;
      const width = this.lattice.width;
      const height = this.lattice.height;
      const CUTOFF = 0.3;
      let intensity;
      for ( let i = dampX; i < width - dampX; i++ ) {
        for ( let k = dampY; k < height - dampY; k++ ) {

          // Color mapping:
          // wave value => color value
          //          1 => 1.0
          //          0 => 0.3
          //         -1 => 0.0
          const waveValue = this.lattice.getInterpolatedValue( k, i );  // Note this is transposed because of the ordering of putImageData

          if ( waveValue > 0 ) {
            intensity = Util.linear( 0, 2, CUTOFF, 1, waveValue );
            intensity = Util.clamp( intensity, CUTOFF, 1 );
          }
          else {
            const MIN_SHADE = 0.03; // Stop before 0 because 0 is too jarring
            intensity = Util.linear( -1.5, 0, MIN_SHADE, CUTOFF, waveValue );
            intensity = Util.clamp( intensity, MIN_SHADE, CUTOFF );
          }

          // Note this interpolation doesn't include the gamma factor that Color.blend does
          let r = this.baseColor.red * intensity;
          let g = this.baseColor.green * intensity;
          let b = this.baseColor.blue * intensity;

          if ( this.vacuumColor && !this.lattice.hasCellBeenVisited( k, i ) ) { // Note this is transposed because of the ordering of putImageData
            r = this.vacuumColor.r;
            g = this.vacuumColor.g;
            b = this.vacuumColor.b;
          }

          const offset = 4 * m;
          data[ offset + 0 ] = r;
          data[ offset + 1 ] = g;
          data[ offset + 2 ] = b;
          data[ offset + 3 ] = 255; // Fully opaque
          m++;
        }
      }
      this.directContext.putImageData( this.imageData, 0, 0 );

      // draw the sub-canvas to the rendering context at the appropriate scale
      context.save();
      context.transform( CELL_WIDTH, 0, 0, CELL_WIDTH, 0, 0 );
      context.drawImage( this.directCanvas, 0, 0 );
      context.restore();
    }
  }

  waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );

  return LatticeCanvasNode;
} );