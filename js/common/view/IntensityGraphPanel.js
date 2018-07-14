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
  const inherit = require( 'PHET_CORE/inherit' );
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

  /**
   * @param {number} graphHeight - the height of the graph in view coordinates
   * @param {IntensitySample} intensitySample - values for the intensity
   * @param {Object} [options]
   * @constructor
   */
  function IntensityGraphPanel( graphHeight, intensitySample, options ) {
    const self = this;

    this.chartRectangle = new Rectangle( 0, 0, 100, graphHeight, { fill: 'white', stroke: 'black', lineWidth: 1 } );

    /**
     * Creates a line an the given y-coordinate.
     * @param {number} y
     * @returns {Line}
     */
    const createLine = function( index, y ) {
      return new Line( self.chartRectangle.left, y, self.chartRectangle.right, y, {
        stroke: index % 2 === 0 ? DARK_GRAY : 'lightGray',
        lineDash: [ 9.1, 9.1 ] // Solid part touches each edge
      } );
    };

    for ( var i = 0; i < 10; i++ ) {
      const yTop = Util.linear( 0, 10, this.chartRectangle.centerY, this.chartRectangle.top, i );
      const yBottom = Util.linear( 0, 10, this.chartRectangle.centerY, this.chartRectangle.bottom, i );
      this.chartRectangle.addChild( createLine( i, yTop ) );
      if ( i !== 0 ) {
        this.chartRectangle.addChild( createLine( i, yBottom ) );
      }
    }

    this.chartRectangle.addChild( new Line( this.chartRectangle.centerX, this.chartRectangle.bottom, this.chartRectangle.centerX, this.chartRectangle.top, {
      stroke: DARK_GRAY,
      lineDash: LINE_DASH
    } ) );

    const tickLabel0 = new WaveInterferenceText( '0', {
      centerTop: this.chartRectangle.leftBottom
    } );
    const tickLabel1 = new WaveInterferenceText( '1', {
      centerTop: this.chartRectangle.rightBottom
    } );
    const title = new WaveInterferenceText( 'Intensity', {
      centerX: this.chartRectangle.centerX,
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
      children: [ this.chartRectangle, curve, tickLabel0, tickLabel1, title ]
    } );

    WaveInterferencePanel.call( this, chartNode, options );

    intensitySample.changedEmitter.addListener( function() {
      const intensityValues = intensitySample.getIntensityValues();
      const shape = new Shape();
      for ( var i = 0; i < intensityValues.length; i++ ) {
        let intensityPlotValue = Util.linear( 0, WaveInterferenceConstants.MAX_AMPLITUDE_TO_PLOT_ON_RIGHT, self.chartRectangle.left, self.chartRectangle.right, intensityValues[ i ] );
        if ( intensityPlotValue > self.chartRectangle.right ) {
          intensityPlotValue = self.chartRectangle.right;
        }
        const positionPlotValue = Util.linear( 0, intensityValues.length - 1, self.chartRectangle.top, self.chartRectangle.bottom, i );
        shape.lineTo( intensityPlotValue, positionPlotValue );
      }
      curve.shape = shape;
    } );
  }

  waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );

  return inherit( WaveInterferencePanel, IntensityGraphPanel, {

    /**
     * Returns the bounds of the chart background in the global coordinate frame, used to align the ScreenNode
     * @returns {Bounds2}
     * @public
     */
    getChartGlobalBounds: function() {
      return this.chartRectangle.globalBounds;
    }
  } );
} );