// Copyright 2019-2022, University of Colorado Boulder

/**
 * A StopwatchNode customized for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import Range from '../../../../dot/js/Range.js';
import StopwatchNode, { StopwatchNodeOptions } from '../../../../scenery-phet/js/StopwatchNode.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type WaveInterferenceStopwatchNodeOtions = SelfOptions & StopwatchNodeOptions;

class WaveInterferenceStopwatchNode extends StopwatchNode {

  public constructor( model: WavesModel, providedOptions?: WaveInterferenceStopwatchNodeOtions ) {

    // Construct the StopwatchNode with the max width for units.
    const widestScene = _.maxBy( model.scenes, scene => new WaveInterferenceText( scene.timeUnits ).width )!;
    const unitsProperty = new StringProperty( widestScene.timeUnits );

    const options = optionize<WaveInterferenceStopwatchNodeOtions, SelfOptions, StopwatchNodeOptions>()( {

      // StopwatchNodeOptions
      numberDisplayRange: new Range( 0, 999.99 ),
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          showAsMinutesAndSeconds: false,
          units: unitsProperty
        } ),
        numberFormatterDependencies: [ unitsProperty ],
        maxWidth: WaveInterferenceConstants.MAX_WIDTH
      }
    }, providedOptions );

    assert && assert( !!options.dragListenerOptions, 'end is a required argument' );
    assert && assert( !!options.dragBoundsProperty, 'dragBoundsProperty is a required argument' );

    super( model.stopwatch, options );

    // After the StopwatchNode is initialized with the max width, use the correct units for the current scene.
    model.sceneProperty.link( scene => {
      unitsProperty.value = scene.timeUnits;
    } );
  }
}

waveInterference.register( 'WaveInterferenceStopwatchNode', WaveInterferenceStopwatchNode );
export default WaveInterferenceStopwatchNode;