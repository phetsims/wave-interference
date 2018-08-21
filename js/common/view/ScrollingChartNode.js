// Copyright 2018, University of Colorado Boulder

/**
 * The scrolling graph component which can be shown in the MeterNode or used alone.  Like a seismograph, it has pens on
 * the right hand side that record data, and the paper scrolls to the left.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DoubleHeadedArrowWithBarsNode = require( 'WAVE_INTERFERENCE/common/view/DoubleHeadedArrowWithBarsNode' ); // TODO: Move to common code
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const PATH_LINE_WIDTH = 2;
  const TOP_MARGIN = 10;
  const RIGHT_MARGIN = 10;
  const GRAPH_CORNER_RADIUS = 5;
  const AXIS_LABEL_FILL = 'white';
  const LABEL_GRAPH_MARGIN = 3;
  const LABEL_EDGE_MARGIN = 6;
  const HORIZONTAL_AXIS_LABEL_MARGIN = 4;

  class ScrollingChartNode extends Node {

    /**
     * @param {Node} verticalAxisTitleNode
     * @param {Node} scaleIndicatorText
     * @param {NumberProperty} timeProperty
     * @param {number} width
     * @param {number} height
     * @param {Object[]} seriesArray, each element has {series: Vector2[],emitter: Emitter, color: Color}
     * @param {string} timeString - text shown beneath the horizontal axis
     * @param {Object} [options]
     */
    constructor( verticalAxisTitleNode, scaleIndicatorText, timeProperty, width, height, seriesArray, timeString, options ) {
      super();

      options = _.extend( {
        isIcon: false,
        timeDivisions: 4
      }, options );

      const LABEL_FONT_SIZE = 14;
      const horizontalAxisTitle = new Text( timeString, {
        fontSize: LABEL_FONT_SIZE,
        fill: AXIS_LABEL_FILL
      } );

      const leftMargin = LABEL_EDGE_MARGIN + verticalAxisTitleNode.width + LABEL_GRAPH_MARGIN;
      const bottomMargin = LABEL_EDGE_MARGIN + horizontalAxisTitle.height + LABEL_GRAPH_MARGIN;

      const graphWidth = width - leftMargin - RIGHT_MARGIN;
      const graphHeight = height - TOP_MARGIN - bottomMargin;

      // Now that we know the graphHeight, use it to limit the text size for the vertical axis label
      verticalAxisTitleNode.maxWidth = graphHeight;

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
        top: TOP_MARGIN,
        pickable: false
      } );

      // Horizontal Lines
      [ 1, 2, 3 ].forEach( i =>
        graphPanel.addChild( new Line( 0, graphHeight * i / 4, graphWidth, graphHeight * i / 4, LINE_OPTIONS ) )
      );

      // There is a blank space on the right side of the graph so there is room for the pens
      const rightGraphMargin = 10;
      const plotWidth = graphWidth - rightGraphMargin;

      // Vertical lines
      [ 1, 2, 3, 4 ].forEach( i =>
        graphPanel.addChild( new Line( plotWidth * i / options.timeDivisions, 0, plotWidth * i / options.timeDivisions, graphHeight, LINE_OPTIONS ) )
      );

      this.addChild( graphPanel );

      horizontalAxisTitle.mutate( {
        top: graphPanel.bottom + LABEL_GRAPH_MARGIN,
        centerX: graphPanel.left + plotWidth / 2
      } );

      verticalAxisTitleNode.mutate( {
        right: graphPanel.left - LABEL_GRAPH_MARGIN,
        centerY: graphPanel.centerY
      } );

      const lengthScaleIndicatorNode = new VBox( {
        spacing: -2,
        children: [

          new DoubleHeadedArrowWithBarsNode( 6, plotWidth / 4, {
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
      this.addChild( verticalAxisTitleNode );

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

      /**
       * Creates and adds a series with the given color
       * @param {Color|string} color
       * @param {Vector2[]} series
       * @param {Emitter} emitter
       */
      const addSeries = ( color, series, emitter ) => {

        // Create the "pens" which draw the data at the right side of the graph
        const penNode = new Circle( 4.5, {
          fill: color,
          centerX: plotWidth,
          centerY: graphHeight / 2
        } );
        const pathNode = new Path( new Shape(), {
          stroke: color,
          lineWidth: PATH_LINE_WIDTH,

          // prevent bounds computations during main loop
          boundsMethod: 'none',
          localBounds: Bounds2.NOTHING
        } );
        pathNode.computeShapeBounds = () => Bounds2.NOTHING; // prevent bounds computations during main loop
        graphPanel.addChild( pathNode );
        graphPanel.addChild( penNode );

        emitter.addListener( () => {

          // Set the range by incorporating the model's time units, so it will match with the timer.
          const maxSeconds = options.timeDivisions; // TODO: assumes timeUnitsConversion is always 1

          // Draw the graph with line segments
          const pathShape = new Shape();
          for ( let i = 0; i < series.length; i++ ) {
            const sample = series[ i ];

            // strong wavefronts (bright colors) are positive on the graph
            const scaledValue = Util.linear( 0, 2, graphHeight / 2, 0, sample.y );

            // Clamp at max values
            const clampedValue = Util.clamp( scaledValue, 0, graphHeight );

            const xAxisValue = Util.linear( timeProperty.value, timeProperty.value - maxSeconds, plotWidth, 0, sample.x );
            pathShape.lineTo( xAxisValue, clampedValue );
            if ( i === series.length - 1 ) {
              penNode.centerY = clampedValue;
            }
          }
          pathNode.shape = pathShape;
        } );
      };

      seriesArray.forEach( series => addSeries( series.color, series.series, series.emitter ) );

      // Stroke on front panel is on top, so that when the curves go to the edges they do not overlap the border stroke.
      // This is a faster alternative to clipping.
      graphPanel.addChild( new Rectangle( 0, 0, graphWidth, graphHeight, GRAPH_CORNER_RADIUS, GRAPH_CORNER_RADIUS, {
        stroke: 'black',
        pickable: false
      } ) );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'ScrollingChartNode', ScrollingChartNode );
} );