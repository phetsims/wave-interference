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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  var TITLE_Y_MARGIN = 4;

  /**
   * @constructor
   */
  function IntensityGraphPanel( chartHeight, options ) {

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
    var chartNode = new Node( {
      children: [ this.chartRectangle, tickLabel0, tickLabel1, title ]
    } );

    WaveInterferencePanel.call( this, chartNode, options );
  }

  waveInterference.register( 'IntensityGraphPanel', IntensityGraphPanel );

  return inherit( WaveInterferencePanel, IntensityGraphPanel, {
    getChartGlobalBounds: function() {
      return this.chartRectangle.globalBounds;
    }
  } );
} );