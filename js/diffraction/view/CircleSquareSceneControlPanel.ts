// Copyright 2019-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Control panel for the CircleSquareScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { HBox } from '../../../../scenery/js/imports.js';
import WaveInterferencePanel from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

const circleDiameterString = WaveInterferenceStrings.circleDiameter;
const mmValueString = WaveInterferenceStrings.mmValue;
const squareWidthString = WaveInterferenceStrings.squareWidth;

class CircleSquareSceneControlPanel extends WaveInterferencePanel {

  public constructor( circleSquareScene, options ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( circleDiameterString, circleSquareScene.circleDiameterProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10 * 1E-3 )
          }
        } ),
        new DiffractionNumberControl( squareWidthString, circleSquareScene.squareWidthProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10 * 1E-3 )
          }
        } )
      ]
    } ), options );
  }
}

waveInterference.register( 'CircleSquareSceneControlPanel', CircleSquareSceneControlPanel );
export default CircleSquareSceneControlPanel;