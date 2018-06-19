// Copyright 2017-2018, University of Colorado Boulder

/**
 * Renders the screen at right hand side of the wave area, showing the time-averaged intensity (for the light scene only).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  var CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;
  var CANVAS_WIDTH = 100;

  // This chooses the saturation point for the screen, as well as the "thinness" of the minima
  var BRIGHTNESS_SCALE_FACTOR = 7;

  /**
   * @param {Lattice} lattice
   * @param {IntensitySample} intensitySample
   * @param {Object} [options]
   * @constructor
   */
  function ScreenNode( lattice, intensitySample, options ) {

    // @private
    this.lattice = lattice;

    // @private
    this.intensitySample = intensitySample;

    // @private
    this.baseColor = new Color( 'blue' );

    var latticeCanvasBounds = WaveInterferenceUtils.getCanvasBounds( lattice );
    options = _.extend( {

      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: new Bounds2( 0, 0, CANVAS_WIDTH, latticeCanvasBounds.height ),
      layerSplit: true // ensure we're on our own layer
    }, options );
    CanvasNode.call( this, options );

    // Render into a sub-canvas which will be drawn into the rendering context at the right scale.
    // Use a single column of pixels, then stretch them to the right (since that is a constant)
    var w = 1;
    var h = this.lattice.height - this.lattice.dampY * 2;
    this.directCanvas = document.createElement( 'canvas' );
    this.directCanvas.width = w;
    this.directCanvas.height = h;
    this.directContext = this.directCanvas.getContext( '2d' );
    this.imageData = this.directContext.createImageData( w, h );

    // Invalidate paint when model indicates changes
    var invalidateSelfListener = this.invalidatePaint.bind( this );
    lattice.changedEmitter.addListener( invalidateSelfListener );

    // Show it at a 3d perspective, as if orthogonal to the wave view
    var shear = Matrix3.dirtyFromPool().setToAffine( 1, 0, 0, -0.5, 1, 0 );
    this.appendMatrix( shear );

    // After shearing, center on the LatticeNode.  Vertical offset determined empirically.
    this.translate( -CANVAS_WIDTH / 2, 0 );
  }

  waveInterference.register( 'ScreenNode', ScreenNode );

  return inherit( CanvasNode, ScreenNode, {

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
     * Draws into the canvas.  Note this logic must be kept in sync with the WebGL fragment shader and LatticeCanvasNode
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {

      var intensityValues = this.intensitySample.getIntensityValues();

      var m = 0;
      var data = this.imageData.data;
      var dampY = this.lattice.dampY;
      var height = this.lattice.height;
      for ( var k = dampY; k < height - dampY; k++ ) {

        var intensity = intensityValues[ k - this.lattice.dampY ];
        var brightness = Util.linear( 0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT, 0, 1, intensity );
        brightness = Util.clamp( brightness * BRIGHTNESS_SCALE_FACTOR, 0, 1 );

        // Note this interpolation doesn't include the gamma factor that Color.blend does
        var r = this.baseColor.red * brightness;
        var g = this.baseColor.green * brightness;
        var b = this.baseColor.blue * brightness;

        var offset = 4 * m;
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
  } );
} );