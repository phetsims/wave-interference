// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable graph node with two probes which begins in the toolbox.  TODO(https://github.com/phetsims/scenery-phet/issues/385): move to common code
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DoubleHeadedArrowWithBarsNode = require( 'WAVE_INTERFERENCE/common/view/DoubleHeadedArrowWithBarsNode' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Shape = require( 'KITE/Shape' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const WaveDetectorToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolProbeNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );

  // strings
  const timeString = require( 'string!WAVE_INTERFERENCE/time' );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );
  const PATH_LINE_WIDTH = 2;
  const TOP_MARGIN = 10;
  const RIGHT_MARGIN = 10;
  const GRAPH_CORNER_RADIUS = 5;
  const AXIS_LABEL_FILL = 'white';
  const LABEL_GRAPH_MARGIN = 3;
  const LABEL_EDGE_MARGIN = 6;
  const HORIZONTAL_AXIS_LABEL_MARGIN = 4;
  const NUMBER_OF_TIME_DIVISIONS = 4;

  // For the wires
  const NORMAL_DISTANCE = 25;
  const PROBE_ATTACHMENT_POINT = 'centerBottom';
  const WIRE_LINE_WIDTH = 3;

  /**
   * @param {WavesScreenModel} model - model for reading values
   * @param {WavesScreenView|null} view - for getting coordinates for model
   * @param {Object} [options]
   * @constructor
   */
  function WaveDetectorToolNode( model, view, options ) {
    const self = this;
    options = _.extend( {
      isIcon: false,
      end: function() {}
    }, options );
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
      },
      end: function() {
        options.end();
        self.synchronizeProbeLocations = false;
      }
    } );
    this.backgroundNode.addInputListener( this.backgroundDragListener );
    this.addChild( this.backgroundNode );

    const LABEL_FONT_SIZE = 14;
    const horizontalAxisTitle = new WaveInterferenceText( timeString, {
      fontSize: LABEL_FONT_SIZE,
      fill: AXIS_LABEL_FILL
    } );

    const verticalAxisTitle = model ? new ToggleNode( [ {
      value: model.waterScene,
      node: new WaveInterferenceText( model.waterScene.verticalAxisTitle, {
        fontSize: LABEL_FONT_SIZE,
        rotation: -Math.PI / 2,
        fill: AXIS_LABEL_FILL
      } )
    }, {
      value: model.soundScene,
      node: new WaveInterferenceText( model.soundScene.verticalAxisTitle, {
        fontSize: LABEL_FONT_SIZE,
        rotation: -Math.PI / 2,
        fill: AXIS_LABEL_FILL
      } )
    }, {
      value: model.lightScene,
      node: new WaveInterferenceText( model.lightScene.verticalAxisTitle, {
        fontSize: LABEL_FONT_SIZE,
        rotation: -Math.PI / 2,
        fill: AXIS_LABEL_FILL
      } )
    } ], model.sceneProperty ) : new WaveInterferenceText( '' );

    const leftMargin = LABEL_EDGE_MARGIN + verticalAxisTitle.width + LABEL_GRAPH_MARGIN;
    const bottomMargin = LABEL_EDGE_MARGIN + horizontalAxisTitle.height + LABEL_GRAPH_MARGIN;

    const graphWidth = this.backgroundNode.width - leftMargin - RIGHT_MARGIN;
    const graphHeight = this.backgroundNode.height - TOP_MARGIN - bottomMargin;

    // Now that we know the graphHeight, use it to limit the text size for the vertical axis label
    verticalAxisTitle.maxWidth = graphHeight;

    const NUMBER_VERTICAL_DASHES = 12;
    const dashLength = graphHeight / NUMBER_VERTICAL_DASHES / 2;

    const DASH_PATTERN = [ dashLength + 0.6, dashLength - 0.6 ];
    const LINE_WIDTH = 0.8;
    const LINE_OPTIONS = {
      stroke: 'lightGray',
      lineDash: DASH_PATTERN,
      lineWidth: LINE_WIDTH,
      lineDashOffset: dashLength / 2
    };

    const graphPanel = new Rectangle( 0, 0, graphWidth, graphHeight, GRAPH_CORNER_RADIUS, GRAPH_CORNER_RADIUS, {
      fill: 'white',
      stroke: 'black', // This stroke is covered by the front panel stroke, only included here to make sure the bounds align
      right: this.backgroundNode.right - RIGHT_MARGIN,
      top: this.backgroundNode.top + TOP_MARGIN,
      pickable: false
    } );

    // Horizontal Lines
    graphPanel.addChild( new Line( 0, graphHeight * 1 / 4, graphWidth, graphHeight * 1 / 4, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( 0, graphHeight * 2 / 4, graphWidth, graphHeight * 2 / 4, LINE_OPTIONS ) );
    graphPanel.addChild( new Line( 0, graphHeight * 3 / 4, graphWidth, graphHeight * 3 / 4, LINE_OPTIONS ) );

    // There is a blank space on the right side of the graph so there is room for the pens
    const rightGraphMargin = 10;
    const availableGraphWidth = graphWidth - rightGraphMargin;

    // Vertical lines
    for ( var i = 1; i <= NUMBER_OF_TIME_DIVISIONS; i++ ) {
      graphPanel.addChild( new Line( availableGraphWidth * i / NUMBER_OF_TIME_DIVISIONS, 0, availableGraphWidth * i / NUMBER_OF_TIME_DIVISIONS, graphHeight, LINE_OPTIONS ) );
    }

    this.backgroundNode.addChild( graphPanel );

    horizontalAxisTitle.mutate( {
      top: graphPanel.bottom + LABEL_GRAPH_MARGIN,
      centerX: graphPanel.left + availableGraphWidth / 2
    } );

    verticalAxisTitle.mutate( {
      right: graphPanel.left - LABEL_GRAPH_MARGIN,
      centerY: graphPanel.centerY
    } );

    const scaleIndicatorText = new WaveInterferenceText( '', { fontSize: 11, fill: 'white' } );
    model.sceneProperty.link( function( scene ) {
      scaleIndicatorText.text = scene.oneTimerUnit;
    } );
    const scaleIndicatorNode = new VBox( {
      spacing: -2,
      children: [

        new DoubleHeadedArrowWithBarsNode( 6, availableGraphWidth / 4, {
          lineOptions: { stroke: 'white' },
          arrowOptions: {
            fill: 'white',
            stroke: 'white',
            headHeight: 3,
            headWidth: 3.5,
            tailWidth: 0.5
          }
        } ),
        scaleIndicatorText
      ],
      left: graphPanel.left,
      top: graphPanel.bottom + 2
    } );
    this.backgroundNode.addChild( scaleIndicatorNode );
    this.backgroundNode.addChild( horizontalAxisTitle );
    this.backgroundNode.addChild( verticalAxisTitle );

    // For i18n, “Time” will expand symmetrically L/R until it gets too close to the scale bar. Then, the string will
    // expand to the R only, until it reaches the point it must be scaled down in size.
    horizontalAxisTitle.maxWidth = graphPanel.right - scaleIndicatorNode.right - 2 * HORIZONTAL_AXIS_LABEL_MARGIN;
    if ( horizontalAxisTitle.left < scaleIndicatorNode.right + HORIZONTAL_AXIS_LABEL_MARGIN ) {
      horizontalAxisTitle.left = scaleIndicatorNode.right + HORIZONTAL_AXIS_LABEL_MARGIN;
    }

    // If maxWidth reduced the scale of the text, it may be too far below the graph.  In that case, move it back up.
    horizontalAxisTitle.mutate( {
      top: graphPanel.bottom + LABEL_GRAPH_MARGIN
    } );

    // @private
    this.probe1Node = new WaveDetectorToolProbeNode( {
      color: SERIES_1_COLOR,
      drag: function() {
        updatePaths();
      }
    } );

    // @private {Node}
    this.probe2Node = new WaveDetectorToolProbeNode( {
      color: SERIES_2_COLOR,
      drag: function() {
        updatePaths();
      }
    } );

    const bodyNormalProperty = new Property( new Vector2( NORMAL_DISTANCE, 0 ) );
    const sensorNormalProperty = new Property( new Vector2( 0, NORMAL_DISTANCE ) );

    const above = function( amount ) {
      return function( rightBottom ) {return rightBottom.plusXY( 0, -amount );};
    };

    // These do not need to be disposed because there is no connection to the "outside world"
    const rightBottomProperty = new NodeProperty( this.backgroundNode, 'bounds', 'rightBottom' );
    const aboveBottomRight1Property = new DerivedProperty( [ rightBottomProperty ], above( 20 ) );
    const aboveBottomRight2Property = new DerivedProperty( [ rightBottomProperty ], above( 10 ) );

    // @private
    this.probe1WireNode = new WireNode(
      aboveBottomRight1Property, bodyNormalProperty,
      new NodeProperty( this.probe1Node, 'bounds', PROBE_ATTACHMENT_POINT ), sensorNormalProperty, {
        lineWidth: WIRE_LINE_WIDTH,
        stroke: SERIES_1_COLOR
      }
    );

    // @private
    this.probe2WireNode = new WireNode(
      aboveBottomRight2Property, bodyNormalProperty,
      new NodeProperty( this.probe2Node, 'bounds', PROBE_ATTACHMENT_POINT ), sensorNormalProperty, {
        lineWidth: WIRE_LINE_WIDTH,
        stroke: WIRE_2_COLOR
      }
    );

    this.addChild( this.probe1WireNode );
    this.addChild( this.probe1Node );

    this.addChild( this.probe2WireNode );
    this.addChild( this.probe2Node );

    this.alignProbes();

    // Create the "pens" which draw the data at the right side of the graph
    const PEN_RADIUS = 4.5;
    const pen1Node = new Circle( PEN_RADIUS, {
      fill: SERIES_1_COLOR,
      centerX: availableGraphWidth,
      centerY: graphHeight / 2
    } );
    const probe1Path = new Path( new Shape(), { stroke: SERIES_1_COLOR, lineWidth: PATH_LINE_WIDTH } );
    probe1Path.computeShapeBounds = function() {return Bounds2.NOTHING;}; // prevent bounds computations during main loop
    graphPanel.addChild( probe1Path );
    graphPanel.addChild( pen1Node );

    const pen2Node = new Circle( PEN_RADIUS, {
      fill: SERIES_2_COLOR,
      centerX: availableGraphWidth,
      centerY: graphHeight / 2
    } );
    const probe2Path = new Path( new Shape(), {
      stroke: SERIES_2_COLOR,
      lineWidth: PATH_LINE_WIDTH,

      // prevent bounds computations during main loop
      boundsMethod: 'none',
      localBounds: Bounds2.NOTHING
    } );
    graphPanel.addChild( probe2Path );
    graphPanel.addChild( pen2Node );

    // Stroke on front panel is on top, so that when the curves go to the edges they do not overlap the border stroke.
    // This is a faster alternative to clipping.
    graphPanel.addChild( new Rectangle( 0, 0, graphWidth, graphHeight, GRAPH_CORNER_RADIUS, GRAPH_CORNER_RADIUS, {
      stroke: 'black',
      pickable: false
    } ) );

    this.mutate( options );

    const probe1Samples = [];
    const probe2Samples = [];

    const updateProbeData = function( probeNode, penNode, probeSamples, probePath, scene ) {

      if ( model.isWaveDetectorToolNodeInPlayAreaProperty.get() ) {

        // Set the range by incorporating the model's time units, so it will match with the timer.
        const maxSeconds = NUMBER_OF_TIME_DIVISIONS / scene.timeUnitsConversion;

        // Look up the location of the cell. The probe node has the cross-hairs at 0,0, so we can use the translation
        // itself as the sensor hot spot.  This doesn't include the damping regions
        const latticeCoordinates = view.globalToLatticeCoordinate( probeNode.parentToGlobalPoint( probeNode.getTranslation() ) );

        const value = model.lattice.getCurrentValue( latticeCoordinates.x + model.lattice.dampX, latticeCoordinates.y + model.lattice.dampY );

        // NaN is returned for out of bounds
        if ( !isNaN( value ) ) {

          // strong wavefronts (bright colors) are positive on the graph
          let chartYValue = Util.linear( 0, 2, graphHeight / 2, 0, value );
          if ( chartYValue > graphHeight ) {
            chartYValue = graphHeight;
          }
          if ( chartYValue < 0 ) {
            chartYValue = 0;
          }
          penNode.centerY = chartYValue;
          probeSamples.push( new Vector2( model.time, chartYValue ) );
        }

        while ( probeSamples.length > 0 && probeSamples[ 0 ].x < model.time - maxSeconds ) {
          probeSamples.shift();
        }

        // TODO(performance): performance caveat
        const pathShape = new Shape();
        for ( var i = 0; i < probeSamples.length; i++ ) {
          const sample = probeSamples[ i ];
          const xAxisValue = Util.linear( model.time, model.time - maxSeconds, availableGraphWidth, 0, sample.x );
          pathShape.lineTo( xAxisValue, sample.y );
        }
        probePath.shape = pathShape;
      }
    };

    const updatePaths = function() {
      updateProbeData( self.probe1Node, pen1Node, probe1Samples, probe1Path, model.sceneProperty.get() );
      updateProbeData( self.probe2Node, pen2Node, probe2Samples, probe2Path, model.sceneProperty.get() );
    };

    // Update the graph value when the lattice changes, but only when this is not for an icon
    if ( !options.isIcon ) {
      model.lattice.changedEmitter.addListener( updatePaths );

      // Redraw the probe data when the scene changes
      model.sceneProperty.link( function() {
        probe1Samples.length = 0;
        probe2Samples.length = 0;
        updatePaths();
      } );
    }

    // @private
    this.resetWaveDetectorToolNode = function() {
      probe1Samples.length = 0;
      probe2Samples.length = 0;
      updatePaths();
      self.alignProbes();
    };
  }

  waveInterference.register( 'WaveDetectorToolNode', WaveDetectorToolNode );

  return inherit( Node, WaveDetectorToolNode, {

    /**
     * Restore the initial conditions
     * @public
     */
    reset: function() {
      this.resetWaveDetectorToolNode();
    },

    /**
     * Put the probes into their standard position relative to the graph body.
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