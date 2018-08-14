// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable graph node with two probes which begins in the toolbox.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const WaveDetectorToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolProbeNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );

  // For the wires
  const NORMAL_DISTANCE = 25;
  const PROBE_ATTACHMENT_POINT = 'centerBottom';
  const WIRE_LINE_WIDTH = 3;

  class WaveDetectorToolNode extends Node {

    /**
     * @param {Node} backgroundNode - node that is shown for the main body
     * @param {Object} [options]
     */
    constructor( backgroundNode, options ) {
      options = _.extend( {

        // This function is called when the a wave detector drag ends.  It can be used to drop it back into a toolbox.
        end: () => {}
      }, options );
      super();

      // @private - true if the probes are being dragged with the wave detector tool
      this.synchronizeProbeLocations = true;

      // @private {Node}
      this.backgroundNode = backgroundNode;

      // @private
      this.backgroundDragListener = new DragListener( {
        translateNode: true,
        drag: () => {
          if ( this.synchronizeProbeLocations ) {
            this.alignProbes();
          }
        },
        end: () => {
          options.end();
          this.synchronizeProbeLocations = false;
        }
      } );
      this.backgroundNode.addInputListener( this.backgroundDragListener );
      this.addChild( this.backgroundNode );

      const bodyNormalProperty = new Property( new Vector2( NORMAL_DISTANCE, 0 ) );
      const sensorNormalProperty = new Property( new Vector2( 0, NORMAL_DISTANCE ) );

      const getPointAbove = amount => position => position.plusXY( 0, -amount );

      // These do not need to be disposed because there is no connection to the "outside world"
      const rightBottomProperty = new NodeProperty( this.backgroundNode, 'bounds', 'rightBottom' );
      const aboveBottomRight1Property = new DerivedProperty( [ rightBottomProperty ], getPointAbove( 20 ) );
      const aboveBottomRight2Property = new DerivedProperty( [ rightBottomProperty ], getPointAbove( 10 ) );

      // @private {Node}
      this.probe1Node = new WaveDetectorToolProbeNode( { color: SERIES_1_COLOR } );

      // @private
      this.addChild( new WireNode( aboveBottomRight1Property, bodyNormalProperty,
        new NodeProperty( this.probe1Node, 'bounds', PROBE_ATTACHMENT_POINT ), sensorNormalProperty, {
          lineWidth: WIRE_LINE_WIDTH,
          stroke: SERIES_1_COLOR
        }
      ) );
      this.addChild( this.probe1Node );

      // @private {Node}
      this.probe2Node = new WaveDetectorToolProbeNode( { color: SERIES_2_COLOR } );

      // @private
      this.addChild( new WireNode( aboveBottomRight2Property, bodyNormalProperty,
        new NodeProperty( this.probe2Node, 'bounds', PROBE_ATTACHMENT_POINT ), sensorNormalProperty, {
          lineWidth: WIRE_LINE_WIDTH,
          stroke: WIRE_2_COLOR
        }
      ) );
      this.addChild( this.probe2Node );

      this.alignProbes();

      this.mutate( options );
    }

    /**
     * Put the probes into their standard position relative to the graph body.
     * @public
     */
    alignProbes() {
      this.probe1Node.mutate( {
        left: this.backgroundNode.right + 5,
        top: this.backgroundNode.top + 10
      } );

      this.probe2Node.mutate( {
        left: this.backgroundNode.right + 36,
        top: this.backgroundNode.top + 54
      } );
    }

    /**
     * Gets the region of the background in global coordinates.
     * @returns {Bounds2}
     */
    getBackgroundNodeGlobalBounds() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    }

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.
     * @param event
     */
    startDrag( event ) {
      this.synchronizeProbeLocations = true;
      this.backgroundDragListener.press( event, this.backgroundNode );
    }
  }

  return waveInterference.register( 'WaveDetectorToolNode', WaveDetectorToolNode );
} );