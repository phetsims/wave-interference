// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Controls the separation of the sources for each Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { Node } from '../../../../scenery/js/imports.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';

const cmValueString = WaveInterferenceStrings.cmValue;
const nmValueString = WaveInterferenceStrings.nmValue;
const separationString = WaveInterferenceStrings.separation;

class SeparationControl extends ToggleNode {

  public constructor( model ) {

    // Ranges, deltas, etc specified in https://github.com/phetsims/wave-interference/issues/177
    const waterSeparationProperty = model.waterScene.desiredSourceSeparationProperty;
    const soundSeparationProperty = model.soundScene.sourceSeparationProperty;
    const lightSeparationProperty = model.lightScene.sourceSeparationProperty;

    const waterSceneRange = waterSeparationProperty.range;
    const soundSceneRange = soundSeparationProperty.range;
    const lightSceneRange = lightSeparationProperty.range;
    const allRanges = [ waterSceneRange, soundSceneRange, lightSceneRange ];

    const createMuteOptions = scene => {
      return {
        startCallback: () => scene.setMuted( true ),
        endCallback: () => scene.setMuted( false )
      };
    };

    // Switch between controls for each scene.  No advantage in using SceneToggleNode in this case
    // because the control constructor calls are substantially different.
    super( model.sceneProperty, [ {
      value: model.waterScene,
      createNode: () => new NumberControl( separationString, waterSeparationProperty, waterSceneRange, merge( {
        delta: 0.1,
        numberDisplayOptions: {
          valuePattern: cmValueString,
          decimalPlaces: 1
        },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 0.5 ),
          majorTicks: createTicks( waterSceneRange, allRanges )
        }
      }, createMuteOptions( model.waterScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.soundScene,
      createNode: () => new NumberControl( separationString, soundSeparationProperty, soundSceneRange, merge( {
        delta: 1,
        numberDisplayOptions: { valuePattern: cmValueString },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 10 ),
          majorTicks: createTicks( soundSceneRange, allRanges )
        }
      }, createMuteOptions( model.soundScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.lightScene,
      createNode: () => new NumberControl( separationString, lightSeparationProperty, lightSceneRange, merge( {
        delta: 10,
        numberDisplayOptions: { valuePattern: nmValueString },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 100 ),
          majorTicks: createTicks( lightSceneRange, allRanges )
        }
      }, createMuteOptions( model.lightScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    } ] );
  }
}


/**
 * Create a label for a NumberControl tick.  The labels have the same bounds for each slider so
 * they don't jitter when changing scenes, see https://github.com/phetsims/wave-interference/issues/214
 * @param string - the string to display
 * @param allStrings - the strings for each scene, for layout
 */
const createTickMarkLabel = ( string: string, allStrings: string[] ): Node => {
  const textNodes = allStrings.map( s => new WaveInterferenceText( s, {
      fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
      maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH,
      visible: s === string,
      centerX: 0
    } )
  );
  return new Node( { children: textNodes } );
};

/**
 * Create the min and max ticks for a NumberControl
 * @param range
 * @param allRanges - to ensure consistent layout across scenes
 * @returns to be used with numberTicks option of NumberControl
 */
const createTicks = ( range, allRanges ): object => [
  { value: range.min, label: createTickMarkLabel( range.min, allRanges.map( r => r.min ) ) },
  { value: range.max, label: createTickMarkLabel( range.max, allRanges.map( r => r.max ) ) }
];

waveInterference.register( 'SeparationControl', SeparationControl );
export default SeparationControl;