// Copyright 2019-2020, University of Colorado Boulder

/**
 * A StopwatchNode customized for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceText from './WaveInterferenceText.js';

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
      stopwatchReadoutNodeOptions: {
        unitsNode: unitsNode
      }
    }, config );
    assert && assert( !!config.dragListenerOptions, 'end is a required argument' );
    assert && assert( !!config.visibleBoundsProperty, 'visibleBoundsProperty is a required argument' );

    super( model.stopwatch, config );

    // After the StopwatchNode is initialized with the maximal layout, use the correct initial value for the current
    // timeUnits
    model.sceneProperty.link( scene => unitsNode.setText( scene.timeUnits ) );
  }
}

waveInterference.register( 'WaveInterferenceStopwatchNode', WaveInterferenceStopwatchNode );
export default WaveInterferenceStopwatchNode;