// Copyright 2017-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { CanvasNode, CanvasNodeOptions, Color } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import Lattice from '../../../../scenery-phet/js/Lattice.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../WaveInterferenceUtils.js';
import ImageDataRenderer from '../../../../scenery-phet/js/ImageDataRenderer.js';

// constants
const CUTOFF = 0.4;

class LatticeCanvasNode extends CanvasNode {

  /**
   * @param lattice
   * @param [options]
   */
  public constructor( lattice: Lattice, options: CanvasNodeOptions ) {

    options = merge( {

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

    // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light
    this.vacuumColor = null;

    // @private - For performance, render into a sub-canvas which will be drawn into the rendering context at the right
    // scale.
    this.imageDataRenderer = new ImageDataRenderer( lattice.visibleBounds.width, lattice.visibleBounds.height );

    // Invalidate paint when model indicates changes
    lattice.changedEmitter.addListener( this.invalidatePaint.bind( this ) );
  }

  /**
   * Convert the given point in the local coordinate frame to the corresponding i,j (integral) lattice coordinates.
   * @param point - point in the local coordinate frame
   */
  public static localPointToLatticePoint( point: Vector2 ): Vector2 {
    return new Vector2(
      Utils.roundSymmetric( point.x / WaveInterferenceConstants.CELL_WIDTH ),
      Utils.roundSymmetric( point.y / WaveInterferenceConstants.CELL_WIDTH )
    );
  }

  /**
   * Sets the color of the peaks of the wave.
   */
  public setBaseColor( color: Color ): void {
    this.baseColor = color;
    this.invalidatePaint();
  }

  /**
   * Draws into the canvas.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    let m = 0;
    const data = this.imageDataRenderer.data;
    const dampX = this.lattice.dampX;
    const dampY = this.lattice.dampY;
    const width = this.lattice.width;
    const height = this.lattice.height;
    let intensity;
    for ( let i = dampX; i < width - dampX; i++ ) {
      for ( let k = dampY; k < height - dampY; k++ ) {

        // Note this is transposed because of the ordering of putImageData
        const waveValue = this.lattice.getInterpolatedValue( k, i );

        if ( waveValue > 0 ) {
          intensity = Utils.linear( 0, 2, CUTOFF, 1, waveValue );
          intensity = Utils.clamp( intensity, CUTOFF, 1 );
        }
        else {
          const MIN_SHADE = 0.03; // Stop before 0 because 0 is too jarring
          intensity = Utils.linear( -1.5, 0, MIN_SHADE, CUTOFF, waveValue );
          intensity = Utils.clamp( intensity, MIN_SHADE, CUTOFF );
        }

        // Note this interpolation doesn't include the gamma factor that Color.blend does
        let r = this.baseColor.red * intensity;
        let g = this.baseColor.green * intensity;
        let b = this.baseColor.blue * intensity;

        // Note this is transposed because of the ordering of putImageData
        if ( this.vacuumColor && !this.lattice.hasCellBeenVisited( k, i ) ) {
          r = this.vacuumColor.r;
          g = this.vacuumColor.g;
          b = this.vacuumColor.b;
        }

        // ImageData.data is Uint8ClampedArray.  Performance is critical and all numbers are non-negative.
        const offset = 4 * m;
        data[ offset ] = Math.round( r ); // eslint-disable-line bad-sim-text
        data[ offset + 1 ] = Math.round( g ); // eslint-disable-line bad-sim-text
        data[ offset + 2 ] = Math.round( b ); // eslint-disable-line bad-sim-text
        data[ offset + 3 ] = 255; // Fully opaque
        m++;
      }
    }
    this.imageDataRenderer.putImageData();

    // draw the sub-canvas to the rendering context at the appropriate scale
    context.save();
    context.transform( WaveInterferenceConstants.CELL_WIDTH, 0, 0, WaveInterferenceConstants.CELL_WIDTH, 0, 0 );
    context.drawImage( this.imageDataRenderer.canvas, 0, 0 );
    context.restore();
  }
}

waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );
export default LatticeCanvasNode;