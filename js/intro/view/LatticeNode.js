// Copyright 2017, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function LatticeNode( lattice ) {
    Node.call( this, { renderer: 'webgl' } );
    var cellWidth = 10;
    var matrix = [];
    for ( var i = 0; i < lattice.width; i++ ) {
      var row = [];
      matrix.push( row );
      for ( var k = 0; k < lattice.height; k++ ) {
        var value = lattice.getCurrentValue( i, k );
        var r = new Rectangle( i * cellWidth, k * cellWidth, cellWidth, cellWidth, {
          fill: new Color( value * 255, 0, 0 ),
        } );
        row.push( r );
        this.addChild( r );
      }
    }

    lattice.changedEmitter.addListener( function() {
      for ( var i = 0; i < lattice.width; i++ ) {
        for ( var k = 0; k < lattice.height; k++ ) {
          var r = matrix[ i ][ k ];
          var value = lattice.getCurrentValue( i, k );
          var x = Util.linear( -2, 2, 0, 255, value );
          x = Util.clamp( x, 0, 255 );
          // console.log( value );
          r.fill = new Color( x, 0, 0 );
        }
      }
    } );
  }

  waveInterference.register( 'LatticeNode', LatticeNode );

  return inherit( Node, LatticeNode );
} );