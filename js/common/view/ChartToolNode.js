// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable chart node with two probes which begins in the toolbox.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WireNode = require( 'WAVE_INTERFERENCE/common/view/WireNode' );
  var ChartToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/ChartToolProbeNode' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ChartToolNode( options ) {
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

    var graphPanel = new Rectangle( 0, 0, 130, 85, 5, 5, { // TODO: hardcoded layout
      fill: 'white',
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
      }
    } );

    // @private
    this.probe2Node = new ChartToolProbeNode( {
      drag: function() {
        self.probe2WireNode.updateWireShape();
      }
    } );

    // @privte
    this.probe1WireNode = new WireNode( this.probe1Node, this.backgroundNode, 'black', 0.8 );

    // @private
    this.probe2WireNode = new WireNode( this.probe2Node, this.backgroundNode, 'black', 0.9 );

    this.addChild( this.probe1WireNode );
    this.addChild( this.probe1Node );

    this.addChild( this.probe2WireNode );
    this.addChild( this.probe2Node );

    this.alignProbes();

    this.mutate( options );
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