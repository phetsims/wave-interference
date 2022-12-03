// Copyright 2019-2022, University of Colorado Boulder

/**
 * Control panel for the WavingGirlScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { HBox } from '../../../../scenery/js/imports.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';
import WavingGirlScene from '../model/WavingGirlScene.js';

const degreesValueString = WaveInterferenceStrings.degreesValue;
const heightString = WaveInterferenceStrings.height;
const mmValueString = WaveInterferenceStrings.mmValue;
const rotationString = WaveInterferenceStrings.rotation;

class WavingGirlSceneControlPanel extends WaveInterferencePanel {

  public constructor( wavingGirlScene: WavingGirlScene, options?: WaveInterferencePanelOptions ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( heightString, wavingGirlScene.heightProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ),
        new DiffractionNumberControl( rotationString, wavingGirlScene.rotationProperty, {
          numberDisplayOptions: {
            valuePattern: degreesValueString
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 30 ), // degrees
            majorTicks: [ {
              value: wavingGirlScene.rotationProperty.range.min,
              label: new WaveInterferenceText( wavingGirlScene.rotationProperty.range.min )
            }, {
              value: wavingGirlScene.rotationProperty.range.max,
              label: new WaveInterferenceText( '360' )
            } ]
          }
        } )
      ]
    } ), options );
  }
}

waveInterference.register( 'WavingGirlSceneControlPanel', WavingGirlSceneControlPanel );
export default WavingGirlSceneControlPanel;