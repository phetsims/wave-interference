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
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );

  // constants
  var TEXT_MARGIN_X = 6;
  var TEXT_MARGIN_Y = 6;
  var CURVE_RADIUS = 6;

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
      .lineTo( topTabBounds.minX, topTabBounds.maxY )
      .lineTo( topTabBounds.minX, topTabBounds.minY )
      .lineTo( topTabBounds.maxX, topTabBounds.minY )
      .lineTo( topTabBounds.maxX, topTabBounds.maxY )
      .lineTo( graphWidth, 0 )
      .lineTo( graphWidth, graphHeight )
      .lineTo( bottomTabBounds.maxX, bottomTabBounds.minY )
      .lineTo( bottomTabBounds.maxX, bottomTabBounds.maxY )
      .lineTo( bottomTabBounds.minX, bottomTabBounds.maxY )
      .lineTo( bottomTabBounds.minX, bottomTabBounds.minY )
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