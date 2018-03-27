// Copyright 2017, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
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
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var CELL_WIDTH = 10; // TODO: this number no longer seems to matter

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

    // only use the visible part for the bounds (not the damping regions)
    options = _.extend( { canvasBounds: new Bounds2( 0, 0, ( lattice.width - lattice.dampX * 2 ) * CELL_WIDTH, ( lattice.height - lattice.dampY * 2 ) * CELL_WIDTH ) }, options );
    CanvasNode.call( this, options );

    var self = this;

    lattice.changedEmitter.addListener( function() {
      self.invalidatePaint();
    } );
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
     * Draws into the canvas
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      for ( var i = this.lattice.dampX; i < this.lattice.width - this.lattice.dampX; i++ ) {
        for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {
          var value = this.lattice.getCurrentValue( i, k );
          var intensity = Util.linear( -2, 2, 0, 1, value );
          intensity = Util.clamp( intensity, 0, 1 );
          var color = this.baseColor.blend( Color.black, intensity ); // TODO: Performance caveat
          if ( this.vacuumColor && !this.lattice.cellHasBeenVisited( i, k ) ) {
            color = this.vacuumColor;
          }
          context.fillStyle = color.toCSS();
          context.fillRect( ( i - this.lattice.dampX ) * CELL_WIDTH, ( k - this.lattice.dampY ) * CELL_WIDTH, CELL_WIDTH + 1, CELL_WIDTH + 1 ); // +1 is to eliminate seams // TODO: x-offset?
        }
      }
    }
  } );
} );