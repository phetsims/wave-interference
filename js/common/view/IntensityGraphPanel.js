// Copyright 2018, University of Colorado Boulder

/**
 * Shows a graph of intensity as a function of position at the right-side of the lattice (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  const TITLE_Y_MARGIN = 4;
  const DARK_GRAY = new Color( 90, 90, 90 );
  const LINE_DASH = [ 9.1, 9.1 ];

  class IntensityGraphPanel extends WaveInterferencePanel {

    /**
     * @param {number} graphHeight - the height of the graph in view coordinates
     * @param {IntensitySample} intensitySample - values for the intensity
     * @param {Object} [options]
     */
    constructor( graphHeight, intensitySample, options ) {

      const chartRectangle = new Rectangle( 0, 0, 100, graphHeight, { fill: 'white', stroke: 'black', lineWidth: 1 } );

      /**
       * Creates a line an the given y-coordinate.
       * @param {number} index
       * @param {number} y
       * @returns {Line}
       */
      const createLine = function( index, y ) {
        return new Line( chartRectangle.left, y, chartRectangle.right, y, {
          stroke: index % 2 === 0 ? DARK_GRAY : 'lightGray',
          lineDash: [ 9.1, 9.1 ] // Solid part touches each edge
        } );
      };

      for ( let i = 0; i < 10; i++ ) {
        const yTop = Util.linear( 0, 10, chartRectangle.centerY, chartRectangle.top, i );
        const yBottom = Util.linear( 0, 10, chartRectangle.centerY, chartRectangle.bottom, i );
        chartRectangle.addChild( createLine( i, yTop ) );
        if ( i !== 0 ) {
          chartRectangle.addChild( createLine( i, yBottom ) );
        }
      }

      chartRectangle.addChild( new Line( chartRectangle.centerX, chartRectangle.bottom, chartRectangle.centerX, chartRectangle.top, {
        stroke: DARK_GRAY,
        lineDash: LINE_DASH
      } ) );

      const tickLabel0 = new WaveInterferenceText( '0', {
        centerTop: chartRectangle.leftBottom
      } );
      const tickLabel1 = new WaveInterferenceText( '1', {
        centerTop: chartRectangle.rightBottom
      } );
      const title = new WaveInterferenceText( 'Intensity', {
        centerX: chartRectangle.centerX,
        top: tickLabel1.bottom + TITLE_Y_MARGIN
      } );
      const curve = new Path( null, {
        stroke: 'black',
        lineWidth: 2,

        // prevent bounds computations during main loop
        boundsMethod: 'none',
        localBounds: Bounds2.NOTHING
      } );

      const chartNode = new Node( {
        children: [ chartRectangle, curve, tickLabel0, tickLabel1, title ]
      } );

      super( chartNode, options );

      // @private
      this.chartRectangle = chartRectangle;

      intensitySample.changedEmitter.addListener( () => {
        const intensityValues = intensitySample.getIntensityValues();
        const shape = new Shape();
        for ( let i = 0; i < intensityValues.length; i++ ) {
          let intensityPlotValue = Util.linear( 0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT, chartRectangle.left, chartRectangle.right, intensityValues[ i ] );
          if ( intensityPlotValue > chartRectangle.right ) {
            intensityPlotValue = chartRectangle.right;
          }
          const positionPlotValue = Util.linear( 0, intensityValues.length - 1, chartRectangle.top, chartRectangle.bottom, i );
          shape.lineTo( intensityPlotValue, positionPlotValue );
        }
        curve.shape = shape;
      } );
    }

    /**
     * Returns the bounds of the chart background in the global coordinate frame, used to align the ScreenNode
     * @returns {Bounds2}
     * @public
     */
    getChartGlobalBounds() {
      return this.chartRectangle.globalBounds;
    }
  }

  return waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );
} );