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
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceTimerNode extends TimerNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} config
     */
    constructor( model, config ) {
      assert && assert( !!config.end, 'end is a required argument' );
      super( model.timerElapsedTimeProperty, model.isTimerRunningProperty, config );

      // @public - for forwarding drag events
      this.timerNodeDragListener = new DragListener( {
        targetNode: this,
        translateNode: true,

        // Drop in toolbox
        end: config.end
      } );

      this.addInputListener( this.timerNodeDragListener );
      model.isTimerInPlayAreaProperty.linkAttribute( this, 'visible' );
      model.sceneProperty.link( scene => this.setUnits( scene.timerUnits ) );
    }
  }

  return waveInterference.register( 'WaveInterferenceTimerNode', WaveInterferenceTimerNode );
} );