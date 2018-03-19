// Copyright 2018, University of Colorado Boulder

/**
 * One probe for the ChartToolNode sensors
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ChartToolProbeNode( options ) {

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

  waveInterference.register( 'ChartToolProbeNode', ChartToolProbeNode );

  return inherit( ProbeNode, ChartToolProbeNode );
} );