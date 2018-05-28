// Copyright 2017-2018, University of Colorado Boulder

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

    // Render into a sub-canvas which will be drawn into the rendering context at the right scale.
    var w = this.lattice.width - this.lattice.dampX * 2;
    var h = this.lattice.height - this.lattice.dampY * 2;
    this.directCanvas = document.createElement( 'canvas' );
    this.directCanvas.width = w;
    this.directCanvas.height = h;
    this.directContext = this.directCanvas.getContext( '2d' );
    this.imageData = this.directContext.createImageData( w, h );

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

      var m = 0;
      var data = this.imageData.data;
      for ( var i = this.lattice.dampX; i < this.lattice.width - this.lattice.dampX; i++ ) {
        for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {

          // Color mapping:
          // wave value => color value
          //          1 => 1.0
          //          0 => 0.3
          //         -1 => 0.0
          var waveValue = this.lattice.getCurrentValue( k, i );  // TODO: un-transpose
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

          // Note this interpolation doesn't include the gamma factor that Color.blend does
          // TODO: Hence the color mismatches the WebGL one
          var r = this.baseColor.red * intensity;
          var g = this.baseColor.green * intensity;
          var b = this.baseColor.blue * intensity;

          if ( this.vacuumColor && !this.lattice.hasCellBeenVisited( k, i ) ) { // TODO: un-transpose
            r = this.vacuumColor.r;
            g = this.vacuumColor.g;
            b = this.vacuumColor.b;
          }

          var offset = 4 * m;
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
  } );
} );