// Copyright 2018, University of Colorado Boulder

/**
 * Shows the semi-transparent chart over the wave area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DottedLineNode = require( 'WAVE_INTERFERENCE/waves/view/DottedLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );

  // constants
  var TEXT_MARGIN_X = 6;
  var TEXT_MARGIN_Y = 6;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaGraphNode( options ) {
    Node.call( this );

    var title = new WaveInterferenceText( 'Water Level at Center' );
    var horizontalAxisLabel = new WaveInterferenceText( 'Position (cm)' );

    var graphWidth = WaveInterferenceConstants.WAVE_AREA_WIDTH;
    var graphHeight = WaveInterferenceConstants.WAVE_AREA_WIDTH / 3;
    var outline = new Shape()
      .moveTo( 0, 0 )
      .lineTo( graphWidth / 2 - title.width / 2 - TEXT_MARGIN_X, 0 )
      .lineToRelative( 0, -title.height - TEXT_MARGIN_Y )
      .lineToRelative( title.width + TEXT_MARGIN_X * 2, 0 )
      .lineToRelative( 0, title.height + TEXT_MARGIN_Y )
      .lineTo( graphWidth, 0 )
      .lineTo( graphWidth, graphHeight )
      .lineTo( graphWidth / 2 + horizontalAxisLabel.width / 2 + TEXT_MARGIN_X, graphHeight )
      .lineToRelative( 0, horizontalAxisLabel.height + TEXT_MARGIN_Y )
      .lineToRelative( -horizontalAxisLabel.width - TEXT_MARGIN_X * 2, 0 )
      .lineToRelative( 0, -horizontalAxisLabel.height - TEXT_MARGIN_Y )
      .lineTo( 0, graphHeight )
      .close();

    var outlinePath = new Path( outline, { lineWidth: 1, stroke: 'black', fill: 'rgba(255,255,255,0.8)' } );
    this.addChild( outlinePath );

    title.centerX = graphWidth / 2;
    title.bottom = 0;
    this.addChild( title );

    horizontalAxisLabel.centerX = graphWidth / 2;
    horizontalAxisLabel.bottom = outlinePath.bottom - TEXT_MARGIN_Y;

    this.addChild( horizontalAxisLabel );

    var dottedLineNode = new DottedLineNode();
    dottedLineNode.centerY = graphHeight / 2;
    this.addChild( dottedLineNode );

    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );

  return inherit( Node, WaveAreaGraphNode );
} );