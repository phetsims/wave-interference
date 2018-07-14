// Copyright 2018, University of Colorado Boulder

/**
 * Shows the draggable TimerNode, which reads out the elapsed time in the appropriate units for the model scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceTimerNode( model, config ) {
    const self = this;
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