// Copyright 2018, University of Colorado Boulder

/**
 * Shows the semi-transparent graph over the lattice area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DashedLineNode = require( 'WAVE_INTERFERENCE/common/view/DashedLineNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // constants
  const TEXT_MARGIN_X = 8;
  const TEXT_MARGIN_Y = 6;

  // Curve radius for the roundings on corners and tabs
  const RADIUS = 5;

  const GRID_LINE_OPTIONS = { stroke: 'gray', lineWidth: 1, lineDash: [ 4, 4 ] };

  class WaveAreaGraphNode extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaBounds, options ) {
      super();

      const graphWidth = WaveInterferenceConstants.WAVE_AREA_WIDTH;
      const graphHeight = WaveInterferenceConstants.WAVE_AREA_WIDTH / 3;

      // Horizontal Axis Label, which updates when the scene changes.  Uses visibility instead of setChildren so that
      // the bottom tab will fit the largest label.
      const horizontalAxisLabel = new ToggleNode( [
        { value: model.waterScene, node: new WaveInterferenceText( model.waterScene.graphHorizontalAxisLabel ) },
        { value: model.soundScene, node: new WaveInterferenceText( model.soundScene.graphHorizontalAxisLabel ) },
        { value: model.lightScene, node: new WaveInterferenceText( model.lightScene.graphHorizontalAxisLabel ) }
      ], model.sceneProperty );

      // Switchable title of the chart
      const title = new ToggleNode( [
        { value: model.waterScene, node: new WaveInterferenceText( model.waterScene.graphTitle ) },
        { value: model.soundScene, node: new WaveInterferenceText( model.soundScene.graphTitle ) },
        { value: model.lightScene, node: new WaveInterferenceText( model.lightScene.graphTitle ) }
      ], model.sceneProperty );

      const horizontalLineY = graphHeight - new WaveInterferenceText( '1' ).height;

      const horizontalAxisTickLabels = [];
      const verticalGridLines = [];
      for ( let i = 0; i <= 10; i++ ) {
        const x = Util.linear( 0, 10, 0, graphWidth, i );

        // Find the position of the tick mark in the units of the scene
        const waterReadout = model.waterScene.waveAreaWidth * x / graphWidth;
        const soundReadout = model.soundScene.waveAreaWidth * x / graphWidth;
        const lightReadout = model.lightScene.waveAreaWidth * x / graphWidth;

        const horizontalAxisTickLabel = new ToggleNode( [ {
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

      const topTabBounds = new Bounds2(
        graphWidth / 2 - title.width / 2 - TEXT_MARGIN_X,
        -TEXT_MARGIN_Y - title.height,
        graphWidth / 2 + title.width / 2 + TEXT_MARGIN_X,
        0
      );
      const bottomTabBounds = new Bounds2(
        graphWidth / 2 - horizontalAxisLabel.width / 2 - TEXT_MARGIN_X,
        graphHeight,
        graphWidth / 2 + horizontalAxisLabel.width / 2 + TEXT_MARGIN_X,
        graphHeight + TEXT_MARGIN_Y + horizontalAxisLabel.height
      );
      const lastTickLabel = horizontalAxisTickLabels[ horizontalAxisTickLabels.length - 1 ];
      const tickBubbleXMargin = 2;

      const verticalAxisLabel = new ToggleNode( [
        { value: model.waterScene, node: new WaveInterferenceText( model.waterScene.verticalAxisTitle ) },
        { value: model.soundScene, node: new WaveInterferenceText( model.soundScene.verticalAxisTitle ) },
        { value: model.lightScene, node: new WaveInterferenceText( model.lightScene.verticalAxisTitle ) }
      ], model.sceneProperty, {
        rotation: 3 * Math.PI / 2,
        right: -TEXT_MARGIN_Y,
        centerY: graphHeight / 2
      } );

      // Nicknames to simplify the rounded corners in the chart
      const UP = 3 * Math.PI / 2;
      const DOWN = Math.PI / 2;
      const RIGHT = 0;
      const LEFT = Math.PI;
      const CLOCKWISE = false;
      const ANTICLOCKWISE = true;

      const outline = new Shape()

      // start at the top left
        .moveTo( RADIUS, 0 )

        // Top tab with title
        .lineTo( topTabBounds.minX - RADIUS, topTabBounds.maxY )
        .arc( topTabBounds.minX - RADIUS, topTabBounds.maxY - RADIUS, RADIUS, DOWN, RIGHT, ANTICLOCKWISE )
        .lineTo( topTabBounds.minX, topTabBounds.minY + RADIUS )
        .arc( topTabBounds.minX + RADIUS, topTabBounds.minY + RADIUS, RADIUS, LEFT, UP, CLOCKWISE )
        .lineTo( topTabBounds.maxX - RADIUS, topTabBounds.minY )
        .arc( topTabBounds.maxX - RADIUS, topTabBounds.minY + RADIUS, RADIUS, UP, RIGHT, CLOCKWISE )
        .lineTo( topTabBounds.maxX, topTabBounds.maxY - RADIUS )
        .arc( topTabBounds.maxX + RADIUS, topTabBounds.maxY - RADIUS, RADIUS, LEFT, DOWN, ANTICLOCKWISE )

        // Right edge, and bubble out around the last horizontal axis tick label
        .lineTo( lastTickLabel.right + tickBubbleXMargin - RADIUS, 0 )
        .arc( lastTickLabel.right + tickBubbleXMargin - RADIUS, RADIUS, RADIUS, UP, RIGHT, CLOCKWISE )
        .lineTo( lastTickLabel.right + tickBubbleXMargin, graphHeight - RADIUS )
        .arc( lastTickLabel.right + tickBubbleXMargin - RADIUS, graphHeight - RADIUS, RADIUS, RIGHT, DOWN, CLOCKWISE )

        // Bottom tab with horizontal axis label
        .lineTo( bottomTabBounds.maxX + RADIUS, bottomTabBounds.minY )
        .arc( bottomTabBounds.maxX + RADIUS, bottomTabBounds.minY + RADIUS, RADIUS, UP, LEFT, ANTICLOCKWISE )
        .lineTo( bottomTabBounds.maxX, bottomTabBounds.maxY - RADIUS )
        .arc( bottomTabBounds.maxX - RADIUS, bottomTabBounds.maxY - RADIUS, RADIUS, RIGHT, DOWN, CLOCKWISE )
        .lineTo( bottomTabBounds.minX + RADIUS, bottomTabBounds.maxY )
        .arc( bottomTabBounds.minX + RADIUS, bottomTabBounds.maxY - RADIUS, RADIUS, DOWN, LEFT, CLOCKWISE )
        .lineTo( bottomTabBounds.minX, bottomTabBounds.minY + RADIUS )
        .arc( bottomTabBounds.minX - RADIUS, bottomTabBounds.minY + RADIUS, RADIUS, RIGHT, UP, ANTICLOCKWISE )

        // Left edge, and bubble out around the first horizontal axis tick label
        .lineTo( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, graphHeight )
        .arc( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, graphHeight - RADIUS, RADIUS, DOWN, LEFT, CLOCKWISE )
        .lineTo( verticalAxisLabel.left - TEXT_MARGIN_Y, RADIUS )
        .arc( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, RADIUS, RADIUS, LEFT, UP, CLOCKWISE )
        .close();

      const outlinePath = new Path( outline, { lineWidth: 1, stroke: 'black', fill: 'rgba(230,230,230,0.6)' } );
      this.addChild( outlinePath );
      horizontalAxisTickLabels.forEach( label => this.addChild( label ) );
      verticalGridLines.forEach( label => this.addChild( label ) );

      title.centerX = graphWidth / 2;
      title.bottom = 0;
      this.addChild( title );

      horizontalAxisLabel.centerX = graphWidth / 2;
      horizontalAxisLabel.bottom = outlinePath.bottom - TEXT_MARGIN_Y;

      this.addChild( horizontalAxisLabel );

      const horizontalAxisLine = new Line( 0, horizontalLineY, graphWidth, horizontalLineY, { stroke: 'darkGray' } );
      this.addChild( horizontalAxisLine );

      // The part that displays the values (doesn't include axis labels)
      const plotHeight = horizontalLineY;

      const dashedLineNode = new DashedLineNode();
      dashedLineNode.centerY = plotHeight / 2;
      this.addChild( dashedLineNode );

      [ 1 / 4, 3 / 4 ].forEach( horizontalGridLineFraction => {
        this.addChild( new Line( 0, horizontalGridLineFraction * plotHeight, graphWidth, horizontalGridLineFraction * plotHeight, GRID_LINE_OPTIONS ) );
      } );

      this.addChild( verticalAxisLabel );

      const path = new Path( new Shape(), {
        stroke: 'black',
        lineWidth: 2,
        lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN, // Prevents artifacts at the wave source

        // prevent bounds computations during main loop
        boundsMethod: 'none',
        localBounds: Bounds2.NOTHING
      } );
      this.addChild( path );

      const array = [];
      const dx = -options.x;
      const dy = -options.centerY / 2 - 1.7;
      model.lattice.changedEmitter.addListener( () => {
        path.shape = WaveInterferenceUtils.getWaterSideShape( array, model.lattice, waveAreaBounds, dx, dy );
      } );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );
} );