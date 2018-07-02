// Copyright 2018, University of Colorado Boulder

/**
 * Shows the draggable TimerNode, which reads out the elapsed time in the appropriate units for the model scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceTimerNode( model, config ) {
    var self = this;
    assert && assert( !!config.end, 'end is a required argument' );
    TimerNode.call( this, model.timerElapsedTimeProperty, model.isTimerRunningProperty, config );

    // @public - for forwarding drag events
    this.timerNodeDragListener = new DragListener( {
      targetNode: this,
      translateNode: true,

      // Drop in toolbox
      end: config.end
    } );

    this.addInputListener( this.timerNodeDragListener );
    model.isTimerInPlayAreaProperty.linkAttribute( this, 'visible' );
    model.sceneProperty.link( function( scene ) {
      self.setUnits( scene.timerUnits );
    } );
  }

  waveInterference.register( 'WaveInterferenceTimerNode', WaveInterferenceTimerNode );

  return inherit( TimerNode, WaveInterferenceTimerNode );
} );