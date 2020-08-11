// Copyright 2019-2020, University of Colorado Boulder

/**
 * A StopwatchNode customized for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Range from '../../../../dot/js/Range.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceText from './WaveInterferenceText.js';

class WaveInterferenceStopwatchNode extends StopwatchNode {

  /**
   * @param {WavesModel} model
   * @param {Object} config
   */
  constructor( model, config ) {

    // Construct the StopwatchNode with the unitsNode reserving the max amount of space it will need
    const widestScene = _.maxBy( model.scenes, scene => new WaveInterferenceText( scene.timeUnits ).width );

    const unitsProperty = new StringProperty( widestScene.timeUnits );

    const createFormatter = units => StopwatchNode.getRichNumberFormatter( {
      showAsDecimal: true,
      units: units
    } );
    config = merge( {
      numberDisplayRange: new Range( 0, 999.99 ),
      numberDisplayOptions: {
        numberFormatter: createFormatter( unitsProperty.value )
      }
    }, config );

    assert && assert( !!config.dragListenerOptions, 'end is a required argument' );
    assert && assert( !!config.visibleBoundsProperty, 'visibleBoundsProperty is a required argument' );

    super( model.stopwatch, config );

    unitsProperty.link( units => this.setNumberFormatter( createFormatter( units ) ) );

    // After the StopwatchNode is initialized with the maximal layout, use the correct initial value for the current
    // timeUnits
    model.sceneProperty.link( scene => {
      unitsProperty.value = scene.timeUnits;
      this.redrawNumberDisplay();
    } );
  }
}

waveInterference.register( 'WaveInterferenceStopwatchNode', WaveInterferenceStopwatchNode );
export default WaveInterferenceStopwatchNode;