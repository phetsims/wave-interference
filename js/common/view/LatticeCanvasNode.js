// Copyright 2017, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  var CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;

  /**
   * @param {Lattice} lattice
   * @param {Object} [options]
   * @constructor
   */
  function LatticeCanvasNode( lattice, options ) {

    // @private
    this.lattice = lattice;

    // @private
    this.baseColor = new Color( 'blue' );

    // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light source
    this.vacuumColor = null;

    options = _.extend( {

      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: WaveInterferenceUtils.getCanvasBounds( lattice ),
      layerSplit: true // ensure we're on our own layer
    }, options );
    CanvasNode.call( this, options );

    // Invalidate paint when model indicates changes
    var invalidateSelfListener = this.invalidatePaint.bind( this );
    lattice.changedEmitter.addListener( invalidateSelfListener );
  }

  waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );

  return inherit( CanvasNode, LatticeCanvasNode, {

    /**
     * Convert the given point (in the local coordinate frame) to the corresponding i,j (integral) coordinates on the lattice.
     * @param {Vector2} point - point in the local coordinate frame
     * @returns {Vector2}
     */
    localPointToLatticePoint: function( point ) {
      return new Vector2( Math.floor( point.x / CELL_WIDTH ), Math.floor( point.y / CELL_WIDTH ) );
    },

    /**
     * Sets the color of the peaks of the wave.
     * @param {Color} color
     * @public
     */
    setBaseColor: function( color ) {
      this.baseColor = color;
      this.invalidatePaint();
    },

    /**
     * Draws into the canvas.  Note this logic must be kept in sync with the WebGL fragment shader.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      for ( var i = this.lattice.dampX; i < this.lattice.width - this.lattice.dampX; i++ ) {
        for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {

          // Color mapping:
          // wave value => color value
          //          1 => 1.0
          //          0 => 0.3
          //         -1 => 0.0
          var waveValue = this.lattice.getCurrentValue( i, k );
          var intensity;
          var CUTOFF = 0.3;
          if ( waveValue > 0 ) {
            intensity = Util.linear( 0, 2, CUTOFF, 1, waveValue );
            intensity = Util.clamp( intensity, CUTOFF, 1 );
          }
          else {
            var MIN_SHADE = 0.03; // Stop before 0 because 0 is too jarring
            intensity = Util.linear( -1.5, 0, MIN_SHADE, CUTOFF, waveValue );
            intensity = Util.clamp( intensity, MIN_SHADE, CUTOFF );
          }

          var color = this.baseColor.blend( Color.black, 1 - intensity ); // TODO(performance): Performance caveat
          if ( this.vacuumColor && !this.lattice.hasCellBeenVisited( i, k ) ) {
            color = this.vacuumColor;
          }
          context.fillStyle = color.toCSS();

          // Fill the cell
          context.fillRect(
            ( i - this.lattice.dampX ) * CELL_WIDTH,
            ( k - this.lattice.dampY ) * CELL_WIDTH,

            // +1 is to eliminate seams
            CELL_WIDTH + 1,
            CELL_WIDTH + 1
          );
        }
      }
    }
  } );
} );