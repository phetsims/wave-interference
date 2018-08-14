// Copyright 2018, University of Colorado Boulder

/**
 * Depicts the draggable graph node with two probes which begins in the toolbox.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Emitter = require( 'AXON/Emitter' );
  const Node = require( 'SCENERY/nodes/Node' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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

      // @public (listen-only)
      this.alignProbesEmitter = new Emitter();

      this.alignProbes();

      this.mutate( options );
    }

    /**
     * Put the probes into their standard position relative to the graph body.
     * @public
     */
    alignProbes() {
      this.alignProbesEmitter.emit();
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