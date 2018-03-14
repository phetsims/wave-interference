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
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var CELL_WIDTH = 10;

  /**
   * @constructor
   */
  function LatticeCanvasNode( lattice, options ) {
    options = _.extend( { canvasBounds: new Bounds2( 0, 0, lattice.width * CELL_WIDTH, lattice.width * CELL_WIDTH ) }, options );
    CanvasNode.call( this, options );
    this.lattice = lattice;
    var self = this;
    lattice.changedEmitter.addListener( function() {
      self.invalidatePaint();
    } );
  }

  waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );

  return inherit( CanvasNode, LatticeCanvasNode, {

    localPointToLatticePoint: function( point ) {
      return new Vector2( Math.floor( point.x / CELL_WIDTH ), Math.floor( point.y / CELL_WIDTH ) );
    },

    paintCanvas: function( context ) {
      for ( var i = this.lattice.dampX; i < this.lattice.width - this.lattice.dampX; i++ ) {
        for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {
          var value = this.lattice.getCurrentValue( i, k );
          var shading = Util.linear( -2, 2, 0, 255, value );
          shading = Math.floor( Util.clamp( shading, 0, 255 ) );
          context.fillStyle = 'rgb(0,0,' + shading + ')';
          context.fillRect( i * CELL_WIDTH, k * CELL_WIDTH, CELL_WIDTH + 1, CELL_WIDTH + 1 ); // +1 is to eliminate seams // TODO: x-offset?
        }
      }
    }
  } );
} );