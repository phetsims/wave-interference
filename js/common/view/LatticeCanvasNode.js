// Copyright 2017-2018, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  class LatticeCanvasNode extends CanvasNode {

    /**
     * @param {Scene} scene
     * @param {Object} [options]
     */
    constructor( scene, options ) {
      const lattice = scene.lattice;

      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: WaveInterferenceUtils.getCanvasBounds( lattice ),
        layerSplit: true, // ensure we're on our own layer
        baseColor: Color.blue
      }, options );

      super( options );

      // @private
      this.lattice = lattice;

      // @private
      this.baseColor = options.baseColor;

      // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light source
      this.vacuumColor = null;

      // Render into a sub-canvas which will be drawn into the rendering context at the right scale.
      const width = this.lattice.width - this.lattice.dampX * 2;
      const height = this.lattice.height - this.lattice.dampY * 2;

      // @private
      this.directCanvas = document.createElement( 'canvas' );
      this.directCanvas.width = width;
      this.directCanvas.height = height;

      // @private
      this.directContext = this.directCanvas.getContext( '2d' );

      // @private
      this.imageData = this.directContext.createImageData( width, height );

      // Invalidate paint when model indicates changes
      const invalidateSelfListener = this.invalidatePaint.bind( this );
      lattice.changedEmitter.addListener( invalidateSelfListener );

      // In development mode, make it easy to see changes in cutoff
      // TODO: delete or keep?  Fine tuning and discussion in https://github.com/phetsims/wave-interference/issues/142
      phet.chipper.queryParameters.dev && setInterval( invalidateSelfListener, 0 );
    }

    /**
     * Convert the given point (in the local coordinate frame) to the corresponding i,j (integral) coordinates on the lattice.
     * @param {Vector2} point - point in the local coordinate frame
     * @returns {Vector2}
     * @public
     */
    static localPointToLatticePoint( point ) {
      return new Vector2(
        Math.floor( point.x / WaveInterferenceConstants.CELL_WIDTH ),
        Math.floor( point.y / WaveInterferenceConstants.CELL_WIDTH )
      );
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
     * Draws into the canvas.
     * @param {CanvasRenderingContext2D} context
     * @public
     */
    paintCanvas( context ) {

      let m = 0;
      const data = this.imageData.data;
      const dampX = this.lattice.dampX;
      const dampY = this.lattice.dampY;
      const width = this.lattice.width;
      const height = this.lattice.height;
      const CUTOFF = WaveInterferenceConstants.CUTOFF.value;
      let intensity;
      for ( let i = dampX; i < width - dampX; i++ ) {
        for ( let k = dampY; k < height - dampY; k++ ) {

          // Note this is transposed because of the ordering of putImageData
          const waveValue = this.lattice.getInterpolatedValue( k, i );

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
          data[ offset ] = r;
          data[ offset + 1 ] = g;
          data[ offset + 2 ] = b;
          data[ offset + 3 ] = 255; // Fully opaque
          m++;
        }
      }
      this.directContext.putImageData( this.imageData, 0, 0 );

      // draw the sub-canvas to the rendering context at the appropriate scale
      context.save();
      context.transform( WaveInterferenceConstants.CELL_WIDTH, 0, 0, WaveInterferenceConstants.CELL_WIDTH, 0, 0 );
      context.drawImage( this.directCanvas, 0, 0 );
      context.restore();
    }
  }

  return waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );
} );