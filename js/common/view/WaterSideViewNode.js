// Copyright 2018, University of Colorado Boulder

/**
 * Shows the water from the side view.
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

  /**
   * @param {Bounds2} waveAreaBounds
   * @param {WavesScreenModel} model
   * @constructor
   */
  function WaterSideViewNode( waveAreaBounds, model ) {

    // @private
    this.waveAreaBounds = waveAreaBounds;

    // @private - depicts the side face (when the user selects "side view")
    this.sideFacePath = new Path( null, { lineJoin: 'round', fill: '#58c0fa' } ); // TODO: factor out color
    // TODO: lineWidth should match Perspective3DNode

    // @private
    this.model = model;

    // @private - reduce garbage by reusing the same array to get model values
    this.array = [];

    Node.call( this, {
      children: [ this.sideFacePath ]
    } );

    model.lattice.changedEmitter.addListener( this.update.bind( this ) );
  }

  waveInterference.register( 'WaterSideViewNode', WaterSideViewNode );

  return inherit( Node, WaterSideViewNode, {

    /**
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update: function() {
      var bounds = this.waveAreaBounds;
      this.model.lattice.getCenterLineValues( this.array );

      var shape = new Shape();
      for ( var i = 0; i < this.array.length; i++ ) {
        var x = Util.linear( 0, this.array.length - 1, this.waveAreaBounds.left, this.waveAreaBounds.right, i );
        var y = Util.linear( 0, 5, this.waveAreaBounds.centerY, this.waveAreaBounds.centerY - 100, this.array[ i ] ); // TODO: would be nice to get exactly the same scaling as in the chart
        shape.lineTo( x, y );
      }
      shape
        .lineTo( bounds.right, bounds.maxY )
        .lineTo( bounds.left, bounds.maxY )
        .close();

      this.sideFacePath.shape = shape;
    }
  } );
} );