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
  var DottedLineNode = require( 'WAVE_INTERFERENCE/waves/view/DottedLineNode' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/waves/view/WaveAreaGraphNode' );

  /**
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaNode( model, options ) {
    Node.call( this );

    var background = new Rectangle( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'blue'
    } );

    this.addChild( background );

    var waveAreaGraphNode = new WaveAreaGraphNode( { centerY: WaveInterferenceConstants.WAVE_AREA_WIDTH * 0.75 } );
    model.showGraphProperty.linkAttribute( waveAreaGraphNode, 'visible' );
    this.addChild( waveAreaGraphNode );

    var dottedLineNode = new DottedLineNode( { centerY: background.centerY } );
    model.showGraphProperty.linkAttribute( dottedLineNode, 'visible' );
    this.addChild( dottedLineNode );
    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaNode', WaveAreaNode );

  return inherit( Node, WaveAreaNode, {}, {
    WIDTH: 530
  } );
} );