// Copyright 2019-2026, University of Colorado Boulder

/**
 * A StopwatchNode customized for Wave Interference
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import StopwatchNode, { StopwatchNodeOptions } from '../../../../scenery-phet/js/StopwatchNode.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

type SelfOptions = EmptySelfOptions;

type WaveInterferenceStopwatchNodeOtions = SelfOptions & StopwatchNodeOptions;

class WaveInterferenceStopwatchNode extends StopwatchNode {

  public constructor( model: WavesModel, providedOptions?: WaveInterferenceStopwatchNodeOtions ) {

    // Construct the StopwatchNode with the max width for units.
    const widestScene = _.maxBy( model.scenes, scene => new WaveInterferenceText( scene.timeUnit.getVisualSymbolString() ).width )!;
    const unitsProperty = new StringProperty( widestScene.timeUnit.getVisualSymbolString() );

    const options = optionize<WaveInterferenceStopwatchNodeOtions, SelfOptions, StopwatchNodeOptions>()( {

      // StopwatchNodeOptions
      numberDisplayRange: new Range( 0, 999.99 ),
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          showAsMinutesAndSeconds: false,
          units: unitsProperty
        } ),
        numberFormatterDependencies: [
          SceneryPhetFluent.stopwatchValueUnitsPatternStringProperty, // used by StopwatchNode.createRichTextNumberFormatter
          unitsProperty
        ],
        maxWidth: WaveInterferenceConstants.MAX_WIDTH
      }
    }, providedOptions );

    affirm( !!options.dragListenerOptions, 'end is a required argument' );
    affirm( !!options.dragBoundsProperty, 'dragBoundsProperty is a required argument' );

    super( model.stopwatch, options );

    // After the StopwatchNode is initialized with the max width, use the correct units for the current scene.
    // Recompute on scene change AND on locale change (each scene's time-unit symbol Property), so the units stay live.
    const updateUnits = () => {
      unitsProperty.value = model.sceneProperty.value.timeUnit.getVisualSymbolString();
    };
    model.sceneProperty.link( updateUnits );

    // Multiple scenes could share the same time-unit symbol Property instance, so link to the unique set to avoid
    // adding the same listener twice.
    _.uniq( model.scenes.map( scene => scene.timeUnit.getVisualSymbolStringProperty() ) ).forEach(
      symbolProperty => symbolProperty.link( updateUnits ) );
  }
}

export default WaveInterferenceStopwatchNode;
