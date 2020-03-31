// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows a graph of intensity as a function of position at the right-side of the lattice (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ZoomButton from '../../../../scenery-phet/js/buttons/ZoomButton.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const intensityString = waveInterferenceStrings.intensity;

// constants
const TITLE_Y_MARGIN = 4;
const DARK_GRAY = new Color( 90, 90, 90 );
const LINE_DASH = [ 9.1, 9.1 ];
const CHART_WIDTH = 100;

class IntensityGraphPanel extends WaveInterferencePanel {

  /**
   * @param {number} graphHeight - the height of the graph in view coordinates
   * @param {IntensitySample} intensitySample - values for the intensity
   * @param {number} numberGridLines - how many vertical grid lines to show
   * @param {Emitter} resetEmitter - emits when the sim is reset
   * @param {Object} [options]
   */
  constructor( graphHeight, intensitySample, numberGridLines, resetEmitter, options ) {

    const chartRectangle = new Rectangle( 0, 0, CHART_WIDTH, graphHeight, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    } );

    /**
     * Creates a line on the given y-coordinate.
     * @param {number} index
     * @param {number} y
     * @returns {Line}
     */
    const createLine = ( index, y ) => new Line( chartRectangle.left, y, chartRectangle.right, y, {
      stroke: index % 2 === 0 ? DARK_GRAY : 'lightGray',
      lineDash: LINE_DASH // Solid part touches each edge
    } );

    for ( let i = 0; i < numberGridLines; i++ ) {
      const yTop = Utils.linear( 0, numberGridLines, chartRectangle.centerY, chartRectangle.top, i );
      const yBottom = Utils.linear( 0, numberGridLines, chartRectangle.centerY, chartRectangle.bottom, i );
      chartRectangle.addChild( createLine( i, yTop ) );
      if ( i !== 0 ) {
        chartRectangle.addChild( createLine( i, yBottom ) );
      }
    }

    chartRectangle.addChild( new Line(
      chartRectangle.centerX,
      chartRectangle.bottom,
      chartRectangle.centerX,
      chartRectangle.top, {
        stroke: DARK_GRAY,
        lineDash: LINE_DASH
      } ) );

    const titleNode = new WaveInterferenceText( intensityString, {
      maxWidth: CHART_WIDTH,
      centerX: chartRectangle.centerX,
      top: chartRectangle.bottom + TITLE_Y_MARGIN
    } );
    const clipArea = Shape.rectangle( 0, 0, CHART_WIDTH, graphHeight );
    const curve = new Path( null, {
      stroke: 'black',
      lineWidth: 2,

      // Prevent rendering outside the charting area
      clipArea: clipArea
    } );

    // Prevent recomputing the bounds of the curve at each time step to improve performance
    curve.computeShapeBounds = () => chartRectangle.bounds;

    // Support for zoom in/out
    const zoomRange = new RangeWithValue( 1, 5, 3 );
    const zoomLevelProperty = new NumberProperty( zoomRange.defaultValue, {
      range: zoomRange
    } );

    // Reset zoom level when sim is reset
    resetEmitter.addListener( () => zoomLevelProperty.reset() );

    const zoomButtonOptions = {
      radius: 6,
      baseColor: ColorConstants.LIGHT_BLUE,
      top: titleNode.bottom + 13
    };

    // Zoom out button on the left
    const zoomOutButton = new ZoomButton( merge( {
      in: false,
      left: chartRectangle.left,
      listener: () => zoomLevelProperty.value--
    }, zoomButtonOptions ) );

    // Zoom in button on the right
    const zoomInButton = new ZoomButton( merge( {
      in: true,
      right: chartRectangle.right,
      listener: () => zoomLevelProperty.value++
    }, zoomButtonOptions ) );

    // Disable zoom buttons at the extrema
    zoomLevelProperty.link( zoomLevel => {
      zoomOutButton.enabled = zoomLevel > zoomRange.min;
      zoomInButton.enabled = zoomLevel < zoomRange.max;
    } );

    const chartNode = new Node( {
      children: [ chartRectangle, curve, titleNode, zoomOutButton, zoomInButton ]
    } );

    super( chartNode, options );

    // @private
    this.chartRectangle = chartRectangle;

    const updateChart = () => {
      const intensityValues = intensitySample.getIntensityValues();
      const shape = new Shape();
      for ( let i = 0; i < intensityValues.length; i++ ) {

        // default scaling is 2
        const SCALING = Utils.linear( zoomRange.min, zoomRange.max, 0.5, 3.5, zoomLevelProperty.value );
        const intensityPlotValue = Utils.linear(
          0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT,
          0, CHART_WIDTH * SCALING,
          intensityValues[ i ]
        );
        const positionPlotValue = Utils.linear(
          0, intensityValues.length - 1,
          chartRectangle.top, chartRectangle.bottom,
          i
        );
        shape.lineTo( intensityPlotValue, positionPlotValue );
      }

      // Add an extension (that will be invisible due to clipping) that has been observed to trick Firefox into
      // increasing its "dirty bounds" area for the shape changes, to prevent duplicate lines from appearing, see
      // https://github.com/phetsims/wave-interference/issues/235.  Perhaps one day when Firefox clipping/svg gets
      // the bounds computation correct, this workaround could be removed.
      shape.lineToRelative( 50, 50 ).lineToRelative( -100, 0 );

      curve.shape = shape;
    };
    intensitySample.changedEmitter.addListener( updateChart );
    zoomLevelProperty.link( updateChart );
  }

  /**
   * Returns the bounds of the chart background in the global coordinate frame, used to align the LightScreenNode
   * @returns {Bounds2}
   * @public
   */
  getChartGlobalBounds() {
    return this.chartRectangle.globalBounds;
  }
}

waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );
export default IntensityGraphPanel;