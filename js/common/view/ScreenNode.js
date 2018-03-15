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
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var CELL_WIDTH = 10;

  /**
   * @param {Lattice} lattice
   * @param {Object} [options]
   * @constructor
   */
  function ScreenNode( lattice, options ) {
    options = _.extend( { canvasBounds: new Bounds2( 0, 0, 100, lattice.width * CELL_WIDTH ) }, options );
    CanvasNode.call( this, options );
    this.lattice = lattice;
    var self = this;
    lattice.changedEmitter.addListener( function() {
      self.invalidatePaint();
    } );
  }

  waveInterference.register( 'ScreenNode', ScreenNode );

  return inherit( CanvasNode, ScreenNode, {

    /**
     * Draws into the canvas
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      var i = this.lattice.width - this.lattice.dampX - 1;
      for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {
        var value = Math.abs( ( this.lattice.getCurrentValue( i, k ) + this.lattice.getLastValue( i, k ) ) / 2 ); // TODO: time average
        var shading = Util.linear( -2, 2, 0, 255, value );
        shading = Math.floor( Util.clamp( shading, 0, 255 ) );
        context.fillStyle = 'rgb(0,0,' + shading + ')';
        context.fillRect( 0, k * CELL_WIDTH, 100, CELL_WIDTH + 1 ); // +1 is to eliminate seams // TODO: x-offset?
      }
    }
  } );
} );