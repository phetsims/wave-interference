// Copyright 2018, University of Colorado Boulder

/**
 * One probe for the WaveMeterNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveMeterProbeNode extends ProbeNode {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        cursor: 'pointer',
        sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
        scale: 0.4,
        drag: () => {}
      }, options );
      super( options );
      this.addInputListener( new DragListener( {
        translateNode: true,
        drag: () => options.drag()
      } ) );
    }
  }

  return waveInterference.register( 'WaveMeterProbeNode', WaveMeterProbeNode );
} );