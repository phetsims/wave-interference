// Copyright 2018, University of Colorado Boulder

/**
 * Shows the semi-transparent graph over the lattice area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DashedLineNode = require( 'WAVE_INTERFERENCE/common/view/DashedLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  var TEXT_MARGIN_X = 8;
  var TEXT_MARGIN_Y = 6;

  // Round the tabs
  var CURVE_RADIUS = 5;

  var GRID_LINE_OPTIONS = { stroke: 'gray', lineWidth: 1, lineDash: [ 4, 4 ] };

  /**
   * @param {WavesScreenModel} model
   * @param {Bounds2} waveAreaBounds
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaGraphNode( model, waveAreaBounds, options ) {
    var self = this;
    Node.call( this );

    var graphWidth = WaveInterferenceConstants.WAVE_AREA_WIDTH;
    var graphHeight = WaveInterferenceConstants.WAVE_AREA_WIDTH / 3;

    // Horizontal Axis Label, which updates when the scene changes.  Uses visibility instead of setChildren so that
    // the bottom tab will fit the largest label.
    var horizontalAxisLabel = new ToggleNode( [
      { value: model.waterScene, node: new WaveInterferenceText( model.waterScene.graphHorizontalAxisLabel ) },
      { value: model.soundScene, node: new WaveInterferenceText( model.soundScene.graphHorizontalAxisLabel ) },
      { value: model.lightScene, node: new WaveInterferenceText( model.lightScene.graphHorizontalAxisLabel ) }
    ], model.sceneProperty );

    // Switchable title of the chart
    var title = new ToggleNode( [
      { value: model.waterScene, node: new WaveInterferenceText( model.waterScene.graphTitle ) },
      { value: model.soundScene, node: new WaveInterferenceText( model.soundScene.graphTitle ) },
      { value: model.lightScene, node: new WaveInterferenceText( model.lightScene.graphTitle ) }
    ], model.sceneProperty );

    var horizontalLineY = graphHeight - new WaveInterferenceText( '1' ).height;

    var horizontalAxisTickLabels = [];
    var verticalGridLines = [];
    for ( var i = 0; i <= 10; i++ ) {
      var x = Util.linear( 0, 10, 0, graphWidth, i );

      // Find the position of the tick mark in the units of the scene
      var waterReadout = model.waterScene.waveAreaWidth * x / graphWidth;
      var soundReadout = model.soundScene.waveAreaWidth * x / graphWidth;
      var lightReadout = model.lightScene.waveAreaWidth * x / graphWidth;

      var horizontalAxisTickLabel = new ToggleNode( [ {
        value: model.waterScene,
        node: new WaveInterferenceText( waterReadout.toFixed( 0 ), { centerX: x, top: horizontalLineY } )
      }, {
        value: model.soundScene,
        node: new WaveInterferenceText( soundReadout.toFixed( 0 ), { centerX: x, top: horizontalLineY } )
      }, {
        value: model.lightScene,
        node: new WaveInterferenceText( lightReadout.toFixed( 0 ), { centerX: x, top: horizontalLineY } )
      } ], model.sceneProperty );
      horizontalAxisTickLabels.push( horizontalAxisTickLabel );
      verticalGridLines.push( new Line( x, horizontalLineY, x, 0, GRID_LINE_OPTIONS ) );
    }

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
    var lastTickLabel = horizontalAxisTickLabels[ horizontalAxisTickLabels.length - 1 ];
    var firstTickLabel = horizontalAxisTickLabels[ 0 ];
    var tickBubbleXMargin = 2;
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

      // Right edge, and bubble out around the last horizontal axis tick label
      .lineTo( graphWidth, 0 )
      .lineTo( graphWidth, lastTickLabel.top )
      .lineTo( lastTickLabel.right + tickBubbleXMargin, lastTickLabel.top )
      .lineTo( lastTickLabel.right + tickBubbleXMargin, lastTickLabel.bottom )
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

      // Left edge, and bubble out around the first horizontal axis tick label
      .lineTo( 0, graphHeight )
      .lineTo( firstTickLabel.left - tickBubbleXMargin, firstTickLabel.bottom )
      .lineTo( firstTickLabel.left - tickBubbleXMargin, firstTickLabel.top )
      .lineTo( 0, firstTickLabel.top )
      .close();

    var outlinePath = new Path( outline, { lineWidth: 1, stroke: 'black', fill: 'rgba(230,230,230,0.9)' } );
    this.addChild( outlinePath );
    var addChild = this.addChild.bind( this );
    horizontalAxisTickLabels.forEach( addChild );
    verticalGridLines.forEach( addChild );

    title.centerX = graphWidth / 2;
    title.bottom = 0;
    this.addChild( title );

    horizontalAxisLabel.centerX = graphWidth / 2;
    horizontalAxisLabel.bottom = outlinePath.bottom - TEXT_MARGIN_Y;

    this.addChild( horizontalAxisLabel );

    var horizontalAxisLine = new Line( 0, horizontalLineY, graphWidth, horizontalLineY, { stroke: 'darkGray' } );
    this.addChild( horizontalAxisLine );

// The part that displays the values (doesn't include axis labels)
    var plotHeight = horizontalLineY;

    var dashedLineNode = new DashedLineNode();
    dashedLineNode.centerY = plotHeight / 2;
    this.addChild( dashedLineNode );

    [ 1 / 4, 3 / 4 ].forEach( function( horizontalGridLineFraction ) {
      self.addChild( new Line( 0, horizontalGridLineFraction * plotHeight, graphWidth, horizontalGridLineFraction * plotHeight, GRID_LINE_OPTIONS ) );
    } );

    var verticalAxisLabel = new WaveInterferenceText( model.sceneProperty.value.verticalAxisTitle, {
      rotation: 3 * Math.PI / 2
    } );
    this.addChild( verticalAxisLabel.mutate( { right: 0 - TEXT_MARGIN_Y } ) );
    model.sceneProperty.link( function( scene ) {
      verticalAxisLabel.text = scene.verticalAxisTitle;
      verticalAxisLabel.centerY = graphHeight / 2;
    } );

    var path = new Path( new Shape(), {
      stroke: 'black',
      lineWidth: 2,
      lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN, // Prevents artifacts at the wave source

      // prevent bounds computations during main loop
      boundsMethod: 'none',
      localBounds: Bounds2.NOTHING
    } );
    this.addChild( path );

    var array = [];
    var dx = -options.x;
    var dy = -options.centerY / 2 - 1.7;
    model.lattice.changedEmitter.addListener( function() {
      path.shape = WaveInterferenceUtils.getWaterSideShape( array, model.lattice, waveAreaBounds, dx, dy );
    } );

    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );

  return inherit( Node, WaveAreaGraphNode );
} )
;