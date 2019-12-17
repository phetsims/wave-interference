// Copyright 2018-2019, University of Colorado Boulder

/**
 * A StopwatchNode customized for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const StopwatchNode = require( 'SCENERY_PHET/StopwatchNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  class WaveInterferenceStopwatchNode extends StopwatchNode {

    /**
     * @param {WavesModel} model
     * @param {Object} config
     */
    constructor( model, config ) {

      // Construct the timer with the unitsNode reserving the max amount of space it will need
      const widestScene = _.maxBy( model.scenes, scene => new WaveInterferenceText( scene.timeUnits ).width );
      const unitsNode = new WaveInterferenceText( widestScene.timeUnits, {
        maxWidth: 40
      } );

      config = merge( {
        maxValue: 999.99,
        timerReadoutNodeOptions: {
          unitsNode: unitsNode
        }
      }, config );
      assert && assert( !!config.dragEndListener, 'end is a required argument' );
      assert && assert( !!config.visibleBoundsProperty, 'visibleBoundsProperty is a required argument' );

      super( model.stopwatch, config );

      // After the StopwatchNode is initialized with the maximal layout, use the correct initial value for the current
      // timeUnits
      model.sceneProperty.link( scene => unitsNode.setText( scene.timeUnits ) );
    }
  }

  return waveInterference.register( 'WaveInterferenceStopwatchNode', WaveInterferenceStopwatchNode );
} );