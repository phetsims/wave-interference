// Copyright 2018, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  var TITLE_Y_MARGIN = 4;

  /**
   * @param {number} chartHeight - the height of the chart in view coordinates
   * @param {IntensitySample} intensitySample - values for the intensity
   * @param {Object} [options]
   * @constructor
   */
  function IntensityGraphPanel( chartHeight, intensitySample, options ) {

    this.chartRectangle = new Rectangle( 0, 0, 100, chartHeight, { fill: 'white', stroke: 'black', lineWidth: 1 } );
    var tickLabel0 = new WaveInterferenceText( '0', {
      centerTop: this.chartRectangle.leftBottom
    } );
    var tickLabel1 = new WaveInterferenceText( '1', {
      centerTop: this.chartRectangle.rightBottom
    } );
    var title = new WaveInterferenceText( 'Intensity', {
      centerX: this.chartRectangle.centerX,
      top: tickLabel1.bottom + TITLE_Y_MARGIN
    } );
    var curve = new Path( null, { stroke: 'black', lineWidth: 2 } );

    var chartNode = new Node( {
      children: [ this.chartRectangle, curve, tickLabel0, tickLabel1, title ]
    } );

    WaveInterferencePanel.call( this, chartNode, options );
    var self = this;

    intensitySample.changedEmitter.addListener( function() {
      var intensityValues = intensitySample.getIntensityValues();
      var shape = new Shape();
      for ( var i = 0; i < intensityValues.length; i++ ) {
        var intensityPlotValue = Util.linear( 0, 0.05, self.chartRectangle.left, self.chartRectangle.right, intensityValues[ i ] );
        if ( intensityPlotValue > self.chartRectangle.right ) {
          intensityPlotValue = self.chartRectangle.right;
        }
        var positionPlotValue = Util.linear( 0, intensityValues.length - 1, self.chartRectangle.top, self.chartRectangle.bottom, i );
        shape.lineTo( intensityPlotValue, positionPlotValue );
      }
      curve.shape = shape;
    } );
  }

  waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );

  return inherit( WaveInterferencePanel, IntensityGraphPanel, {
    getChartGlobalBounds: function() {
      return this.chartRectangle.globalBounds;
    }
  } );
} );