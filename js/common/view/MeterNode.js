// Copyright 2018, University of Colorado Boulder

/**
 * Depicts a draggable meter node with an arbitrary number of probes which can optionally travel with the meter.
 * This type is also set up for usage in a toolbox, including dragging out of a toolbox and dropping back in a toolbox.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Node} backgroundNode - node that is shown for the main body
   * @param {Object} [options]
   */
  function MeterNode( backgroundNode, options ) {

    var self = this;
    options = _.extend( {

      // This function is called when the a wave detector drag ends.  It can be used to drop it back into a toolbox.
      end: function() {}
    }, options );
    Node.call( this );

    // @private {boolean} - true if the probes are being dragged with the wave detector tool
    this.synchronizeProbeLocations = true;

    // @private {Node}
    this.backgroundNode = backgroundNode;

    // @private
    this.backgroundDragListener = new DragListener( {
      translateNode: true,
      drag: function() {
        if ( self.synchronizeProbeLocations ) {
          self.alignProbes();
        }
      },
      end: function() {
        options.end();
        self.synchronizeProbeLocations = false;
      }
    } );
    this.backgroundNode.addInputListener( this.backgroundDragListener );
    this.addChild( this.backgroundNode );

    // @public (listen-only) {Emitter}
    this.alignProbesEmitter = new Emitter();

    this.alignProbes();

    // Mutate after backgroundNode is added as a child
    this.mutate( options );
  }

  inherit( Node, MeterNode, {

    /**
     * Put the probes into their standard position relative to the graph body.
     * @public
     */
    alignProbes: function() {
      this.alignProbesEmitter.emit();
    },

    /**
     * Gets the region of the background in global coordinates.  This can be used to determine if the MeterNode should
     * be dropped back in a toolbox.
     * @returns {Bounds2}
     */
    getBackgroundNodeGlobalBounds: function() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    },

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.
     * @param {Object} event
     */
    startDrag: function( event ) {
      this.synchronizeProbeLocations = true;
      this.backgroundDragListener.press( event, this.backgroundNode );
    }
  } );
  return waveInterference.register( 'MeterNode', MeterNode );
} );