// Copyright 2017, University of Colorado Boulder

/**
 * Renders the screen at the right hand side of the lattice which collects photons in light view.
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
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  var CELL_WIDTH = WaveInterferenceConstants.CELL_WIDTH;

  /**
   * @param {Lattice} lattice - for dimensions
   * @param {IntensitySample} intensitySample
   * @param {Object} [options]
   * @constructor
   */
  function ScreenNode( lattice, intensitySample, options ) {

    var self = this;

    options = _.extend( {
      canvasBounds: new Bounds2( 0, 0, 100, 2000 ) // TODO: this seems to do nothing
    }, options );
    CanvasNode.call( this, options );

    // @private
    this.lattice = lattice;

    // @private
    this.intensitySample = intensitySample;

    // @private
    this.baseColor = Color.blue;

    intensitySample.changedEmitter.addListener( function() {
      self.invalidatePaint();
    } );

    // Show it at a 3d perspective, as if orthogonal to the wave view
    var shear = Matrix3.dirtyFromPool().setToAffine( 1, 0, 0, -0.5, 1, 0 );
    this.appendMatrix( shear );
    this.translate( -50, -202 ); // Center on the wave // TODO: factor out dimension (half of 100) // TODO: Magic numbers
  }

  waveInterference.register( 'ScreenNode', ScreenNode );

  return inherit( CanvasNode, ScreenNode, {

    /**
     * Sets the base color for the screen, corresponding to the color of the incoming light
     * @param {Color} baseColor
     */
    setBaseColor: function( baseColor ) {
      this.baseColor = baseColor;
      this.invalidatePaint();
    },

    /**
     * Draws into the canvas
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {

      // TODO: align with LatticeCanvasNode
      var intensityValues = this.intensitySample.getIntensityValues();
      for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {
        var intensity = intensityValues[ k - this.lattice.dampY ];
        var brightness = Util.linear( 0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT, 0, 1, intensity );
        brightness = Util.clamp( brightness, 0, 1 );
        var color = this.baseColor.blend( Color.black, 1 - brightness );
        context.fillStyle = color.toCSS();
        context.fillRect( 0, k * CELL_WIDTH, 100, CELL_WIDTH + 1 ); // +1 is to eliminate seams // TODO: x-offset?
      }
    }
  } );
} );