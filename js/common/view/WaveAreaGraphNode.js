// Copyright 2018, University of Colorado Boulder

/**
 * Shows the semi-transparent chart over the lattice area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/common/view/DottedLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  var TEXT_MARGIN_X = 8;
  var TEXT_MARGIN_Y = 6;

  // Round the tabs
  var CURVE_RADIUS = 5;

  var GRID_LINE_OPTIONS = { stroke: 'gray', lineWidth: 1, lineDash: [ 4, 4 ] };

  /**
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaGraphNode( model, options ) {
    var self = this;
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

    var outlinePath = new Path( outline, { lineWidth: 1, stroke: 'black', fill: 'rgba(230,230,230,0.9)' } );
    this.addChild( outlinePath );

    title.centerX = graphWidth / 2;
    title.bottom = 0;
    this.addChild( title );

    horizontalAxisLabel.centerX = graphWidth / 2;
    horizontalAxisLabel.bottom = outlinePath.bottom - TEXT_MARGIN_Y;

    this.addChild( horizontalAxisLabel );

    var horizontalLineY = graphHeight - new WaveInterferenceText( '1' ).height; // TODO: factor out
    var horizontalAxisLine = new Line( 0, horizontalLineY, graphWidth, horizontalLineY, { stroke: 'darkGray' } );
    this.addChild( horizontalAxisLine );

    for ( var i = 0; i <= 10; i++ ) {
      var x = Util.linear( 0, 10, 0, graphWidth, i );
      var horizontalAxisTickLabel = new WaveInterferenceText( '' + i, {
        centerX: x,
        top: horizontalLineY
      } );
      this.addChild( horizontalAxisTickLabel );

      var verticalGridLine = new Line( x, horizontalLineY, x, 0, GRID_LINE_OPTIONS );
      this.addChild( verticalGridLine );
    }

    // The part that displays the values (doesn't include axis labels)
    var plotHeight = horizontalLineY;

    var dottedLineNode = new DottedLineNode();
    dottedLineNode.centerY = plotHeight / 2;
    this.addChild( dottedLineNode );

    [ 1 / 4, 3 / 4 ].forEach( function( horizontalGridLineFraction ) {
      self.addChild( new Line( 0, horizontalGridLineFraction * plotHeight, graphWidth, horizontalGridLineFraction * plotHeight, GRID_LINE_OPTIONS ) );
    } );

    var verticalAxisLabel = new WaveInterferenceText( 'Water Height', {
      rotation: 3 * Math.PI / 2
    } );
    this.addChild( verticalAxisLabel.mutate( { right: 0 - TEXT_MARGIN_Y, centerY: graphHeight / 2 } ) );

    var path = new Path( new Shape(), {
      stroke: 'black',
      lineWidth: 2,
      lineJoin: 'round' // Prevents artifacts at the wave source. // TODO: factor out to match side view
    } );
    this.addChild( path );

    var array = [];
    model.stepEmitter.addListener( function() {
      var s = new Shape();

      array = model.lattice.getCenterLineValues( array );
      for ( var i = 0; i < array.length; i++ ) {
        var element = array[ i ];
        var x = Util.linear( 0, array.length - 1, 0, graphWidth, i );
        var y = Util.linear( 10, -10, 0, plotHeight, element ); // Note the inversion of the y-axis, so peaks of the waveform correspond to peaks on the chart
        s.lineTo( x, y );
      }

      path.shape = s;
    } );

    this.mutate( options );
  }

  waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );

  return inherit( Node, WaveAreaGraphNode );
} );