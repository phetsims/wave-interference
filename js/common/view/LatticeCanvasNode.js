// Copyright 2017, University of Colorado Boulder

/**
 *
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

  /**
   * @constructor
   */
  function LatticeCanvasNode( lattice ) {
    this.cellWidth = 10;
    CanvasNode.call( this, { canvasBounds: new Bounds2( 0, 0, lattice.width * this.cellWidth, lattice.width * this.cellWidth ) } );
    this.lattice = lattice;
    var self = this;
    lattice.changedEmitter.addListener( function() {
      self.invalidatePaint();
    } );
  }

  waveInterference.register( 'LatticeCanvasNode', LatticeCanvasNode );

  return inherit( CanvasNode, LatticeCanvasNode, {

    paintCanvas: function( context ) {
      for ( var i = this.lattice.dampX; i < this.lattice.width - this.lattice.dampX; i++ ) {
        for ( var k = this.lattice.dampY; k < this.lattice.height - this.lattice.dampY; k++ ) {
          var value = this.lattice.getCurrentValue( i, k );
          var x = Util.linear( -2, 2, 0, 255, value );
          x = Math.floor( Util.clamp( x, 0, 255 ) );
          context.fillStyle = 'rgb(' + x + ',0,0)';
          context.fillRect( i * this.cellWidth, k * this.cellWidth, this.cellWidth, this.cellWidth );
        }
      }
    }
  } );
} );