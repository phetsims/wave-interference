// Copyright 2019-2020, University of Colorado Boulder

/**
 * Control panel for the WavingGirlScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import WaveInterferencePanel from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import waveInterference from '../../waveInterference.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

const degreesValueString = waveInterferenceStrings.degreesValue;
const heightString = waveInterferenceStrings.height;
const mmValueString = waveInterferenceStrings.mmValue;
const rotationString = waveInterferenceStrings.rotation;

class WavingGirlSceneControlPanel extends WaveInterferencePanel {

  /**
   * @param {WavingGirlScene} wavingGirlScene
   * @param {Object} [options]
   */
  constructor( wavingGirlScene, options ) {
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