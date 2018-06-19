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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  /**
   * @param {Bounds2} waveAreaBounds
   * @param {WavesScreenModel} model
   * @constructor
   */
  function WaterSideViewNode( waveAreaBounds, model ) {

    // @private
    this.waveAreaBounds = waveAreaBounds;

    // @private - depicts the side face (when the user selects "side view")
    this.sideFacePath = new Path( null, {
      lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN,
      fill: WaveInterferenceConstants.WATER_SIDE_COLOR
    } );

    // @private
    this.model = model;

    // @private - reduce garbage by reusing the same array to get model values
    this.array = [];

    Node.call( this, {
      children: [ Rectangle.bounds( waveAreaBounds, { fill: '#e2e3e5' } ), this.sideFacePath ]
    } );

    model.lattice.changedEmitter.addListener( this.update.bind( this ) );
  }

  waveInterference.register( 'WaterSideViewNode', WaterSideViewNode );

  return inherit( Node, WaterSideViewNode, {

    /**
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update: function() {
      var shape = WaveInterferenceUtils.getWaterSideShape( this.array, this.model.lattice, this.waveAreaBounds, 0, 0 )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.maxY )
        .lineTo( this.waveAreaBounds.left, this.waveAreaBounds.maxY )
        .close();
      this.sideFacePath.shape = shape;
    }
  } );
} );