// Copyright 2018-2024, University of Colorado Boulder

/**
 * Shows a graph of intensity as a function of position at the right-side of the lattice (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const intensityString = WaveInterferenceStrings.intensity;

// constants
const TITLE_Y_MARGIN = 4;
const DARK_GRAY = new Color( 90, 90, 90 );
const LINE_DASH = [ 9.1, 9.1 ];
const CHART_WIDTH = 100;

type IntensityGraphPanelOptions = EmptySelfOptions;

class IntensityGraphPanel extends WaveInterferencePanel {
  private readonly chartRectangle: Rectangle;

  /**
   * @param graphHeight - the height of the graph in view coordinates
   * @param intensitySample - values for the intensity
   * @param numberGridLines - how many vertical grid lines to show
   * @param resetEmitter - emits when the sim is reset
   * @param [options]
   */
  public constructor( graphHeight: number, intensitySample: number[], numberGridLines: number, resetEmitter: Emitter, options?: IntensityGraphPanelOptions ) {

    const chartRectangle = new Rectangle( 0, 0, CHART_WIDTH, graphHeight, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    } );

    /**
     * Creates a line on the given y-coordinate.
     */
    const createLine = ( index: number, y: number ) => new Line( chartRectangle.left, y, chartRectangle.right, y, {
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

    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      spacing: 35,
      top: titleNode.bottom + 13,
      buttonOptions: {
        baseColor: ColorConstants.LIGHT_BLUE
      },
      magnifyingGlassNodeOptions: {
        glassRadius: 6
      }
    } );

    const chartNode = new Node( {
      children: [ chartRectangle, curve, titleNode, zoomButtonGroup ]
    } );

    // @ts-expect-error
    super( chartNode, options );

    this.chartRectangle = chartRectangle;

    const updateChart = () => {

      // @ts-expect-error
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

    // @ts-expect-error
    intensitySample.changedEmitter.addListener( updateChart );
    zoomLevelProperty.link( updateChart );
  }

  /**
   * Returns the bounds of the chart background in the global coordinate frame, used to align the LightScreenNode
   */
  public getChartGlobalBounds(): Bounds2 {
    return this.chartRectangle.globalBounds;
  }
}

waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );
export default IntensityGraphPanel;