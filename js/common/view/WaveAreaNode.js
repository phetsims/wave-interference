// Copyright 2018, University of Colorado Boulder

/**
 * Shows the wave and any objects in the wave area (such as slits), including (if selected) the dotted line and graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaNode( model, options ) {
    Node.call( this );

    var background = new Rectangle( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, {

      // This node is used for layout, so don't include a stroke which could misadjust the width
      fill: 'blue'
    } );

    this.addChild( background );

    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaNode', WaveAreaNode );

  return inherit( Node, WaveAreaNode, {}, {
    WIDTH: 530
  } );
} );