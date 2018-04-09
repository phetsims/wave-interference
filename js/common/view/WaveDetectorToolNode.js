// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable chart node with two probes which begins in the toolbox.  TODO: move to common code
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var WaveDetectorToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolProbeNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WireNode = require( 'WAVE_INTERFERENCE/common/view/WireNode' );

  // constants
  var SECONDS_TO_SHOW = 2;
  var SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  var SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  var PATH_LINE_WIDTH = 2;

  var TOP_MARGIN = 10;
  var RIGHT_MARGIN = 10;
  var GRAPH_CORNER_RADIUS = 5;
  var AXIS_LABEL_FILL = 'white';
  var LABEL_GRAPH_MARGIN = 3;
  var LABEL_EDGE_MARGIN = 6;
  var HORIZONAL_AXIS_LABEL_MARGIN = 4;

  /**
   * @param {WavesScreenModel|null} model - model for reading values, null for icon
   * @param {WavesScreenView|null} view - for getting coordinates for model
   * @param {Object} [options]
   * @constructor
   */
  function WaveDetectorToolNode( model, view, options ) {
    var self = this;

    options = _.extend( { end: function() {} }, options );

    Node.call( this );

    // @private - true if the probes are being dragged with the wave detector tool
    this.synchronizeProbeLocations = true;

    // @private
    this.backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, 181.5, 145.2 ), {
      cursor: 'pointer'
    } );

    // @private
    this.backgroundDragListener = new DragListener( {
      translateNode: true,
      drag: function() {
        if ( self.synchronizeProbeLocations ) {

          self.alignProbes();

          // When the wave is paused and the user is dragging the entire WaveDetectorToolNode with the probes aligned, they
          // need to sample their new locations
          updatePaths();
        }
        self.probe1WireNode.updateWireShape();
        self.probe2WireNode.updateWireShape();
      },
      end: function() {
        options.end();
        self.synchronizeProbeLocations = false;
      }
    } );
    this.backgroundNode.addInputListener( this.backgroundDragListener );
    this.addChild( this.backgroundNode );

    var LABEL_FONT_SIZE = 14;
    var horizontalAxisTitle = new WaveInterferenceText( 'Time', {
      fontSize: LABEL_FONT_SIZE,
      fill: AXIS_LABEL_FILL
    } );

    var verticalAxisTitle = new WaveInterferenceText( 'Water Height (cm)', {
      fontSize: LABEL_FONT_SIZE,
      rotation: -Math.PI / 2,
      fill: AXIS_LABEL_FILL
    } );

    var leftMargin = LABEL_EDGE_MARGIN + verticalAxisTitle.width + LABEL_GRAPH_MARGIN;
    var bottomMargin = LABEL_EDGE_MARGIN + horizontalAxisTitle.height + LABEL_GRAPH_MARGIN;

    var graphWidth = this.backgroundNode.width - leftMargin - RIGHT_MARGIN; // TODO: flatten after tweaking
    var graphHeight = this.backgroundNode.height - TOP_MARGIN - bottomMargin; // TODO: flatten after tweaking

    // Now that we know the graphHeight, use it to limit the text size for the vertical axis label
    verticalAxisTitle.maxWidth = graphHeight;

    var NUMBER_VERTICAL_DASHES = 12;
    var dashLength = graphHeight / NUMBER_VERTICAL_DASHES / 2;

    var DASH_PATTERN = [ dashLength + 0.6, dashLength - 0.6 ];
    var LINE_WIDTH = 0.8;
    var LINE_OPTIONS = {
      stroke: 'lightGray',
      lineDash: DASH_PATTERN,
      lineWidth: LINE_WIDTH,
      lineDashOffset: dashLength / 2
    };

    var graphPanel = new Rectangle( 0, 0, graphWidth, graphHeight, GRAPH_CORNER_RADIUS, GRAPH_CORNER_RADIUS, {
      fill: 'white',
      stroke: 'black',
      right: this.backgroundNode.right - RIGHT_MARGIN,
      top: this.backgroundNode.top + TOP_MARGIN,
      pickable: false
    } );

    // Horizontal Lines
    graphPanel.addChild( new Line( 0, graphHeight / 4, graphWidth, graphHeight / 4, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( 0, graphHeight / 2, graphWidth, graphHeight / 2, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( 0, graphHeight * 3 / 4, graphWidth, graphHeight * 3 / 4, LINE_OPTIONS ) );

    // There is a blank space on the right side of the graph so there is room for the pens
    var rightGraphMargin = 10;
    var availableGraphWidth = graphWidth - rightGraphMargin;

    // Vertical lines
    graphPanel.addChild( new Line( availableGraphWidth / 4, 0, availableGraphWidth / 4, graphHeight, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( availableGraphWidth / 2, 0, availableGraphWidth / 2, graphHeight, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( availableGraphWidth * 3 / 4, 0, availableGraphWidth * 3 / 4, graphHeight, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( availableGraphWidth, 0, availableGraphWidth, graphHeight, LINE_OPTIONS ) );

    this.backgroundNode.addChild( graphPanel );

    horizontalAxisTitle.mutate( {
      top: graphPanel.bottom + LABEL_GRAPH_MARGIN,
      centerX: graphPanel.left + availableGraphWidth / 2
    } );

    verticalAxisTitle.mutate( {
      right: graphPanel.left - LABEL_GRAPH_MARGIN,
      centerY: graphPanel.centerY
    } );

    var scaleIndicatorNode = new VBox( {
      spacing: -2,
      children: [

        // TODO: factor out with the one at the top of the wave graph area
        new HBox( {
          children: [
            new Rectangle( 0, 0, 1, 6, { fill: 'white' } ),
            new ArrowNode( 0, 0, graphWidth / 4 - 4, 0, {
              fill: 'white',
              stroke: 'white',
              headHeight: 3,
              headWidth: 3.5,
              tailWidth: 0.5,
              doubleHead: true
            } ),
            new Rectangle( 0, 0, 1, 6, { fill: 'white' } )
          ]
        } ),
        new WaveInterferenceText( '1 s', { fontSize: 11, fill: 'white' } )
      ],
      left: graphPanel.left + 1,
      top: graphPanel.bottom + 2
    } );
    this.backgroundNode.addChild( scaleIndicatorNode );
    this.backgroundNode.addChild( horizontalAxisTitle );
    this.backgroundNode.addChild( verticalAxisTitle );

    // For i18n, “Time” will expand symmetrically L/R until it gets too close to the scale bar. Then, the string will
    // expand to the R only, until it reaches the point it must be scaled down in size.
    horizontalAxisTitle.maxWidth = graphPanel.right - scaleIndicatorNode.right - 2 * HORIZONAL_AXIS_LABEL_MARGIN;
    if ( horizontalAxisTitle.left < scaleIndicatorNode.right + HORIZONAL_AXIS_LABEL_MARGIN ) {
      horizontalAxisTitle.left = scaleIndicatorNode.right + HORIZONAL_AXIS_LABEL_MARGIN;
    }

    // If maxWidth reduced the scale of the text, it may be too far below the chart.  In that case, move it back up.
    horizontalAxisTitle.mutate( {
      top: graphPanel.bottom + LABEL_GRAPH_MARGIN
    } );

    // @private
    this.probe1Node = new WaveDetectorToolProbeNode( {
      color: SERIES_1_COLOR,
      drag: function() {
        self.probe1WireNode.updateWireShape();
        updatePaths();
      }
    } );

    // @private
    this.probe2Node = new WaveDetectorToolProbeNode( {
      color: SERIES_2_COLOR,
      drag: function() {
        self.probe2WireNode.updateWireShape();
        updatePaths();
      }
    } );

    // @private
    this.probe1WireNode = new WireNode( this.probe1Node, this.backgroundNode, SERIES_1_COLOR, 0.8 );

    // @private
    this.probe2WireNode = new WireNode( this.probe2Node, this.backgroundNode, new Color( SERIES_2_COLOR ).darkerColor( 0.7 ), 0.9 );

    this.addChild( this.probe1WireNode );
    this.addChild( this.probe1Node );

    this.addChild( this.probe2WireNode );
    this.addChild( this.probe2Node );

    this.alignProbes();

    // Create the "pens" which draw the data at the right side of the graph
    var PEN_RADIUS = 4.5;
    var pen1Node = new Circle( PEN_RADIUS, {
      fill: SERIES_1_COLOR,
      centerX: availableGraphWidth,
      centerY: graphHeight / 2
    } );
    var probe1Path = new Path( new Shape(), { stroke: SERIES_1_COLOR, lineWidth: PATH_LINE_WIDTH } );
    graphPanel.addChild( probe1Path );
    graphPanel.addChild( pen1Node );

    var pen2Node = new Circle( PEN_RADIUS, {
      fill: SERIES_2_COLOR,
      centerX: availableGraphWidth,
      centerY: graphHeight / 2
    } );
    var probe2Path = new Path( new Shape(), { stroke: SERIES_2_COLOR, lineWidth: PATH_LINE_WIDTH } );
    graphPanel.addChild( probe2Path );
    graphPanel.addChild( pen2Node );

    this.mutate( options );

    var probe1Samples = [];
    var probe2Samples = [];

    var updateProbeData = function( probeNode, penNode, probeSamples, probePath ) {

      if ( model.isWaveDetectorToolNodeInPlayAreaProperty.get() ) {

        // Look up the location of the cell. The probe node has the cross-hairs at 0,0, so we can use the translation
        // itself as the sensor hot spot.  This doesn't include the damping regions
        var latticeCoordinates = view.globalToLatticeCoordinate( probeNode.parentToGlobalPoint( probeNode.getTranslation() ) );

        var value = model.lattice.getCurrentValue( latticeCoordinates.x + model.lattice.dampX, latticeCoordinates.y + model.lattice.dampY );

        // NaN is returned for out of bounds
        if ( !isNaN( value ) ) {

          // strong wavefronts (bright colors) are positive on the chart
          var chartYValue = Util.linear( 0, 1, graphHeight / 2, 0, value );
          if ( chartYValue > graphHeight ) {
            chartYValue = graphHeight;
          }
          if ( chartYValue < 0 ) {
            chartYValue = 0;
          }
          penNode.centerY = chartYValue;
          probeSamples.push( new Vector2( model.time, chartYValue ) );
        }

        while ( probeSamples.length > 0 && probeSamples[ 0 ].x < model.time - SECONDS_TO_SHOW ) {
          probeSamples.shift();
        }

        // TODO: performance caveat
        var pathShape = new Shape();
        for ( var i = 0; i < probeSamples.length; i++ ) {
          var sample = probeSamples[ i ];
          var xAxisValue = Util.linear( model.time, model.time - SECONDS_TO_SHOW, availableGraphWidth, 0, sample.x );
          pathShape.lineTo( xAxisValue, sample.y );
        }
        probePath.shape = pathShape;
      }
    };

    var updatePaths = function() {
      updateProbeData( self.probe1Node, pen1Node, probe1Samples, probe1Path );
      updateProbeData( self.probe2Node, pen2Node, probe2Samples, probe2Path );
    };

    // Update the chart value when the lattice changes
    model && model.lattice.changedEmitter.addListener( updatePaths );
  }

  waveInterference.register( 'WaveDetectorToolNode', WaveDetectorToolNode );

  return inherit( Node, WaveDetectorToolNode, {

    /**
     * Put the probes into their standard position relative to the chart body.
     */
    alignProbes: function() {

      this.probe1Node.mutate( {
        left: this.backgroundNode.right + 5,
        top: this.backgroundNode.top + 10
      } );

      this.probe2Node.mutate( {
        left: this.probe1Node.right - 10,
        top: this.probe1Node.bottom - 10
      } );

      this.probe1WireNode.updateWireShape();
      this.probe2WireNode.updateWireShape();
    },

    getBackgroundNodeGlobalBounds: function() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    },

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.
     * @param event
     */
    startDrag: function( event ) {
      this.backgroundDragListener.press( event, this.backgroundNode );
      this.synchronizeProbeLocations = true;
    }
  } );
} );