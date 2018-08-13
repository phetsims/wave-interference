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
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceTimerNode extends TimerNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} config
     */
    constructor( model, config ) {

      const unitsNode = new SceneToggleNode( model, scene => new Text( scene.timeUnits ), {
        alignChildren: ToggleNode.LEFT
      } );

      config = _.extend( { unitsNode, maxValue: 999.99 }, config );
      assert && assert( !!config.end, 'end is a required argument' );
      super( model.timerElapsedTimeProperty, model.isTimerRunningProperty, config );

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

  return waveInterference.register( 'WaveInterferenceTimerNode', WaveInterferenceTimerNode );
} );