// Copyright 2018, University of Colorado Boulder

/**
 * Shows the draggable TimerNode, which reads out the elapsed time in the appropriate units for the model scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceTimerNode extends TimerNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} config
     */
    constructor( model, config ) {

      // Construct the timer with the unitsNode reserving the max amount of space it will need
      const widestScene = _.maxBy( model.scenes, scene => new Text( scene.timeUnits ).width );
      const unitsNode = new Text( widestScene.timeUnits );

      config = _.extend( {
        unitsNode,
        maxValue: 999.99,
        isIcon: false
      }, config );
      assert && assert( !!config.end, 'end is a required argument' );
      super( model.timerElapsedTimeProperty, model.isTimerRunningProperty, config );

      // After the TimerNode is initialized with the maximal layout, use the correct initial value for the current timeUnits
      model.sceneProperty.link( scene => unitsNode.setText( scene.timeUnits ) );

      if ( !config.isIcon ) {

        // @public - for forwarding drag events
        this.timerNodeDragListener = new DragListener( {
          targetNode: this,
          translateNode: true,

          // Drop in toolbox
          end: config.end
        } );

        this.dragTarget.addInputListener( this.timerNodeDragListener );
        model.isTimerInPlayAreaProperty.linkAttribute( this, 'visible' );
      }
    }
  }

  return waveInterference.register( 'WaveInterferenceTimerNode', WaveInterferenceTimerNode );
} );