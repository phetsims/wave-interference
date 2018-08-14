// Copyright 2018, University of Colorado Boulder

/**
 * The scrolling graph component shown in the WaveDetectorToolNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DoubleHeadedArrowWithBarsNode = require( 'WAVE_INTERFERENCE/common/view/DoubleHeadedArrowWithBarsNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const timeString = require( 'string!WAVE_INTERFERENCE/time' );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const PATH_LINE_WIDTH = 2;
  const TOP_MARGIN = 10;
  const RIGHT_MARGIN = 10;
  const GRAPH_CORNER_RADIUS = 5;
  const AXIS_LABEL_FILL = 'white';
  const LABEL_GRAPH_MARGIN = 3;
  const LABEL_EDGE_MARGIN = 6;
  const HORIZONTAL_AXIS_LABEL_MARGIN = 4;
  const NUMBER_OF_TIME_DIVISIONS = 4;

  class ScrollingChartNode extends Node {

    /**
     * @param {WavesScreenModel} model - model for reading values
     * @param {number} width
     * @param {number} height
     * @param {Vector2[]} probe1Samples
     * @param {Vector2[]} probe2Samples
     * @param {Object} [options]
     */
    constructor( model, width, height, probe1Samples, probe2Samples, options ) {
      super();

      options = _.extend( {
        isIcon: false
      }, options );

      const LABEL_FONT_SIZE = 14;
      const horizontalAxisTitle = new WaveInterferenceText( timeString, {
        fontSize: LABEL_FONT_SIZE,
        fill: AXIS_LABEL_FILL
      } );

      const verticalAxisTitle = model ? new SceneToggleNode( model, scene => new WaveInterferenceText( scene.verticalAxisTitle, {
          fontSize: LABEL_FONT_SIZE,
          rotation: -Math.PI / 2,
          fill: AXIS_LABEL_FILL
        } )
      ) : new WaveInterferenceText( '' );

      const leftMargin = LABEL_EDGE_MARGIN + verticalAxisTitle.width + LABEL_GRAPH_MARGIN;
      const bottomMargin = LABEL_EDGE_MARGIN + horizontalAxisTitle.height + LABEL_GRAPH_MARGIN;

      const graphWidth = width - leftMargin - RIGHT_MARGIN;
      const graphHeight = height - TOP_MARGIN - bottomMargin;

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
        right: width - RIGHT_MARGIN,
        top: 0 + TOP_MARGIN,
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
      for ( let i = 1; i <= NUMBER_OF_TIME_DIVISIONS; i++ ) {
        graphPanel.addChild( new Line( availableGraphWidth * i / NUMBER_OF_TIME_DIVISIONS, 0, availableGraphWidth * i / NUMBER_OF_TIME_DIVISIONS, graphHeight, LINE_OPTIONS ) );
      }

      this.addChild( graphPanel );

      horizontalAxisTitle.mutate( {
        top: graphPanel.bottom + LABEL_GRAPH_MARGIN,
        centerX: graphPanel.left + availableGraphWidth / 2
      } );

      verticalAxisTitle.mutate( {
        right: graphPanel.left - LABEL_GRAPH_MARGIN,
        centerY: graphPanel.centerY
      } );

      const scaleIndicatorText = new WaveInterferenceText( '', { fontSize: 11, fill: 'white' } );
      model.sceneProperty.link( scene => {
        scaleIndicatorText.text = scene.oneTimerUnit;
      } );
      const lengthScaleIndicatorNode = new VBox( {
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

      this.addChild( lengthScaleIndicatorNode );
      this.addChild( horizontalAxisTitle );
      this.addChild( verticalAxisTitle );

      // For i18n, “Time” will expand symmetrically L/R until it gets too close to the scale bar. Then, the string will
      // expand to the R only, until it reaches the point it must be scaled down in size.
      horizontalAxisTitle.maxWidth = graphPanel.right - lengthScaleIndicatorNode.right - 2 * HORIZONTAL_AXIS_LABEL_MARGIN;
      if ( horizontalAxisTitle.left < lengthScaleIndicatorNode.right + HORIZONTAL_AXIS_LABEL_MARGIN ) {
        horizontalAxisTitle.left = lengthScaleIndicatorNode.right + HORIZONTAL_AXIS_LABEL_MARGIN;
      }

      // If maxWidth reduced the scale of the text, it may be too far below the graph.  In that case, move it back up.
      horizontalAxisTitle.mutate( {
        top: graphPanel.bottom + LABEL_GRAPH_MARGIN
      } );

      // Create the "pens" which draw the data at the right side of the graph
      const PEN_RADIUS = 4.5;
      const pen1Node = new Circle( PEN_RADIUS, {
        fill: SERIES_1_COLOR,
        centerX: availableGraphWidth,
        centerY: graphHeight / 2
      } );
      const probe1Path = new Path( new Shape(), { stroke: SERIES_1_COLOR, lineWidth: PATH_LINE_WIDTH } );
      probe1Path.computeShapeBounds = () => Bounds2.NOTHING; // prevent bounds computations during main loop
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

      const updateProbeData = function( penNode, probeSamples, probePath, scene ) {

        // Set the range by incorporating the model's time units, so it will match with the timer.
        const maxSeconds = NUMBER_OF_TIME_DIVISIONS / scene.timeUnitsConversion;

        // Draw the graph with line segments
        const pathShape = new Shape();
        for ( let i = 0; i < probeSamples.length; i++ ) {
          const sample = probeSamples[ i ];

          // strong wavefronts (bright colors) are positive on the graph
          const scaledValue = Util.linear( 0, 2, graphHeight / 2, 0, sample.y );

          // Clamp at max values
          const clampedValue = Util.clamp( scaledValue, 0, graphHeight );

          const xAxisValue = Util.linear( model.time, model.time - maxSeconds, availableGraphWidth, 0, sample.x );
          pathShape.lineTo( xAxisValue, clampedValue );
          if ( i === probeSamples.length - 1 ) {
            penNode.centerY = clampedValue;
          }
        }
        probePath.shape = pathShape;
      };

      const updatePaths = () => {
        updateProbeData( pen1Node, probe1Samples, probe1Path, model.sceneProperty.get() );
        updateProbeData( pen2Node, probe2Samples, probe2Path, model.sceneProperty.get() );
      };

      // Update the graph value when the lattice changes, but only when this is not for an icon
      if ( !options.isIcon ) {
        model.lattice.changedEmitter.addListener( updatePaths );

        // Redraw the probe data when the scene changes
        model.sceneProperty.link( () => {
          probe1Samples.length = 0;
          probe2Samples.length = 0;
          updatePaths();
        } );
      }

      model.resetEmitter.addListener( () => {
        probe1Samples.length = 0;
        probe2Samples.length = 0;
        updatePaths();
      } );
    }
  }

  return waveInterference.register( 'ScrollingChartNode', ScrollingChartNode );
} );