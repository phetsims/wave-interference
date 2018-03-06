// Copyright 2018, University of Colorado Boulder

/**
 * Shows the semi-transparent chart over the wave area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/waves/view/DottedLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );

  // constants
  var TEXT_MARGIN_X = 8;
  var TEXT_MARGIN_Y = 6;

  // Round the tabs
  var CURVE_RADIUS = 5;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaGraphNode( options ) {
    Node.call( this );

    var title = new WaveInterferenceText( 'Water Height at Center' );
    var horizontalAxisLabel = new WaveInterferenceText( 'Position (cm)' );

    var graphWidth = WaveInterferenceConstants.WAVE_AREA_WIDTH;
    var graphHeight = WaveInterferenceConstants.WAVE_AREA_WIDTH / 3;

    var topTabBounds = new Bounds2(
      graphWidth / 2 - title.width / 2 - TEXT_MARGIN_X,
      -TEXT_MARGIN_Y - title.height,
      graphWidth / 2 + title.width / 2 + TEXT_MARGIN_X,
      0
    );
    var bottomTabBounds = new Bounds2(
      graphWidth / 2 - horizontalAxisLabel.width / 2 - TEXT_MARGIN_X,
      graphHeight,
      graphWidth / 2 + horizontalAxisLabel.width / 2 + TEXT_MARGIN_X,
      graphHeight + TEXT_MARGIN_Y + horizontalAxisLabel.height
    );
    var outline = new Shape()
      .moveTo( 0, 0 )

      // Top tab with title
      .lineTo( topTabBounds.minX - CURVE_RADIUS, topTabBounds.maxY )
      .arc( topTabBounds.minX - CURVE_RADIUS, topTabBounds.maxY - CURVE_RADIUS, CURVE_RADIUS, Math.PI / 2, 0, true )
      .lineTo( topTabBounds.minX, topTabBounds.minY + CURVE_RADIUS )
      .arc( topTabBounds.minX + CURVE_RADIUS, topTabBounds.minY + CURVE_RADIUS, CURVE_RADIUS, Math.PI, 3 * Math.PI / 2, false )
      .lineTo( topTabBounds.maxX - CURVE_RADIUS, topTabBounds.minY )
      .arc( topTabBounds.maxX - CURVE_RADIUS, topTabBounds.minY + CURVE_RADIUS, CURVE_RADIUS, 3 * Math.PI / 2, 0, false )
      .lineTo( topTabBounds.maxX, topTabBounds.maxY - CURVE_RADIUS )
      .arc( topTabBounds.maxX + CURVE_RADIUS, topTabBounds.maxY - CURVE_RADIUS, CURVE_RADIUS, Math.PI, Math.PI / 2, true )

      // Right edge
      .lineTo( graphWidth, 0 )
      .lineTo( graphWidth, graphHeight )

      // Bottom tab with horizontal axis label
      .lineTo( bottomTabBounds.maxX + CURVE_RADIUS, bottomTabBounds.minY )
      .arc( bottomTabBounds.maxX + CURVE_RADIUS, bottomTabBounds.minY + CURVE_RADIUS, CURVE_RADIUS, 3 / 2 * Math.PI, Math.PI, true )
      .lineTo( bottomTabBounds.maxX, bottomTabBounds.maxY - CURVE_RADIUS )
      .arc( bottomTabBounds.maxX - CURVE_RADIUS, bottomTabBounds.maxY - CURVE_RADIUS, CURVE_RADIUS, 0, Math.PI / 2, false )
      .lineTo( bottomTabBounds.minX + CURVE_RADIUS, bottomTabBounds.maxY )
      .arc( bottomTabBounds.minX + CURVE_RADIUS, bottomTabBounds.maxY - CURVE_RADIUS, CURVE_RADIUS, Math.PI / 2, Math.PI, false )
      .lineTo( bottomTabBounds.minX, bottomTabBounds.minY + CURVE_RADIUS )
      .arc( bottomTabBounds.minX - CURVE_RADIUS, bottomTabBounds.minY + CURVE_RADIUS, CURVE_RADIUS, 0, Math.PI * 3 / 2, true )

      // Left edge
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

    var verticalAxisLabel = new WaveInterferenceText( 'Water Height', {
      rotation: 3 * Math.PI / 2
    } );
    this.addChild( verticalAxisLabel.mutate( { right: 0 - TEXT_MARGIN_Y, centerY: graphHeight / 2 } ) );

    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );

  return inherit( Node, WaveAreaGraphNode );
} );