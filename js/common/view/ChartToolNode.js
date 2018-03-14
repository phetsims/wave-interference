// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable chart node with two probes which begins in the toolbox.  TODO: move to common code
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ChartToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/ChartToolProbeNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WireNode = require( 'WAVE_INTERFERENCE/common/view/WireNode' );

  // constants
  var SECONDS_TO_SHOW = 2;

  /**
   * @param {WavesScreenModel|null} model - model for reading values, null for icon
   * @param {WavesScreenView|null} view - for getting coordinates for model
   * @param {Object} [options]
   * @constructor
   */
  function ChartToolNode( model, view, options ) {
    var self = this;

    options = _.extend( { end: function() {} }, options );

    Node.call( this );

    // @private
    this.synchronizeProbeLocations = true;

    // TODO: copied from TimerNode
    // @private
    this.backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, 150, 120 ), {
      baseColor: new Color( 80, 130, 230 ),
      cornerRadius: 10,
      cursor: 'pointer'
    } );

    // @private
    this.backgroundDragListener = new DragListener( {
      translateNode: true,
      drag: function() {
        if ( self.synchronizeProbeLocations ) {

          self.alignProbes();
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

    var graphWidth = 130;
    var graphHeight = 85;
    var graphPanel = new Rectangle( 0, 0, graphWidth, graphHeight, 5, 5, { // TODO: hardcoded layout
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      centerX: this.backgroundNode.centerX,
      top: this.backgroundNode.top + 10,
      pickable: false
    } );
    this.backgroundNode.addChild( graphPanel );

    var horizontalAxisTitle = new WaveInterferenceText( 'Time', {
      top: graphPanel.bottom + 3,
      centerX: this.backgroundNode.centerX,
      fill: 'white'
    } );
    this.backgroundNode.addChild( horizontalAxisTitle );

    // @private
    this.probe1Node = new ChartToolProbeNode( {
      drag: function() {
        self.probe1WireNode.updateWireShape();
        updatePaths();
      }
    } );

    // @private
    this.probe2Node = new ChartToolProbeNode( {
      drag: function() {
        self.probe2WireNode.updateWireShape();
        updatePaths();
      }
    } );

    // @private
    this.probe1WireNode = new WireNode( this.probe1Node, this.backgroundNode, 'black', 0.8 );

    // @private
    this.probe2WireNode = new WireNode( this.probe2Node, this.backgroundNode, 'black', 0.9 );

    this.addChild( this.probe1WireNode );
    this.addChild( this.probe1Node );

    this.addChild( this.probe2WireNode );
    this.addChild( this.probe2Node );

    this.alignProbes();

    var penNode = new Circle( 3, { fill: 'blue' } );
    penNode.right = graphPanel.width;
    var probe1Path = new Path( new Shape(), { stroke: 'blue', lineWidth: 2 } );
    graphPanel.addChild( probe1Path );
    graphPanel.addChild( penNode );

    this.mutate( options );

    var probe1Samples = [];

    var updatePaths = function() {

      // Look up the location of the cell

      // TODO: also update value if probe moves?  What if paused?  Will the value be indicated on the probe, perhaps on the
      // right side of the chart?

      // The probe node has the cross-hairs at 0,0, so we can use the translation itself as the sensor hot spot
      var latticeCoordinate = view.globalToLatticeCoordinate( self.probe1Node.parentToGlobalPoint( self.probe1Node.getTranslation() ) );

      var value = model.waveInterferenceModel.lattice.getCurrentValue( latticeCoordinate.x, latticeCoordinate.y );

      // NaN is returned for out of bounds
      if ( !isNaN( value ) ) {

        // strong wavefronts (bright colors) are positive on the chart // TODO: is this inverted in the canvas?
        var chartYValue = Util.linear( 0, 1, graphHeight / 2, 0, value );
        if ( chartYValue > graphHeight ) {
          chartYValue = graphHeight;
        }
        if ( chartYValue < 0 ) {
          chartYValue = 0;
        }
        penNode.centerY = chartYValue;
        probe1Samples.push( new Vector2( model.waveInterferenceModel.time, chartYValue ) );
        while ( probe1Samples[ 0 ].x < model.waveInterferenceModel.time - SECONDS_TO_SHOW ) {
          probe1Samples.shift();
        }

        // TODO: performance caveat
        var probe1Shape = new Shape();
        for ( var i = 0; i < probe1Samples.length; i++ ) {
          var sample = probe1Samples[ i ];
          var xAxisValue = Util.linear( model.waveInterferenceModel.time, model.waveInterferenceModel.time - SECONDS_TO_SHOW, graphWidth, 0, sample.x );
          probe1Shape.lineTo( xAxisValue, sample.y );
        }
        probe1Path.shape = probe1Shape;
      }
    };
    model && model.stepEmitter.addListener( updatePaths );
  }

  waveInterference.register( 'ChartToolNode', ChartToolNode );

  return inherit( Node, ChartToolNode, {

    /**
     * Put the probes into their standard position relative to the chart body.
     */
    alignProbes: function() {

      this.probe1Node.mutate( {

        // TODO: factor out if this works
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