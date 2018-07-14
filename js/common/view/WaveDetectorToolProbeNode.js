// Copyright 2018, University of Colorado Boulder

/**
 * One probe for the WaveDetectorToolNode sensors
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function WaveDetectorToolProbeNode( options ) {

    options = _.extend( {
      cursor: 'pointer',
      sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
      scale: 0.4,
      drag: function() {}
    }, options );
    ProbeNode.call( this, options );
    this.addInputListener( new DragListener( {
      translateNode: true,
      drag: function() {
        options.drag();
      }
    } ) );
  }

  waveInterference.register( 'WaveDetectorToolProbeNode', WaveDetectorToolProbeNode );

  return inherit( ProbeNode, WaveDetectorToolProbeNode );
} );