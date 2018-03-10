// Copyright 2018, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var NUM_SAMPLES = 100;
  var MIN_ANGLE = 0;
  var MAX_ANGLE = Math.PI * 2 + Math.PI;

  var MIN_X = 0;
  var MAX_X = 50;
  var WAVE_HEIGHT = 10;

  /**
   * @constructor
   */
  function ContinuousWaveIconNode() {
    Node.call( this );

    var shape = new Shape();
    for ( var i = 0; i < NUM_SAMPLES; i++ ) {
      var angle = Util.linear( 0, NUM_SAMPLES - 1, MIN_ANGLE, MAX_ANGLE, i );

      var y = -Math.cos( angle ) * WAVE_HEIGHT;
      var x = Util.linear( MIN_ANGLE, MAX_ANGLE, MIN_X, MAX_X, angle );
      if ( i === 0 ) {
        shape.moveTo( x, y );
      }
      else {
        shape.lineTo( x, y );
      }
    }
    this.addChild( new Path( shape, {
      stroke: 'black',
      lineWidth: 2
    } ) );
  }

  waveInterference.register( 'ContinuousWaveIconNode', ContinuousWaveIconNode );

  return inherit( Node, ContinuousWaveIconNode );
} );