// Copyright 2019-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Control panel for the RectangleScene.
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

const heightString = WaveInterferenceStrings.height;
const mmValueString = WaveInterferenceStrings.mmValue;
const widthString = WaveInterferenceStrings.width;

class RectangleSceneControlPanel extends WaveInterferencePanel {

  public constructor( rectangleScene, options ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( widthString, rectangleScene.widthProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ),
        new DiffractionNumberControl( heightString, rectangleScene.heightProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ) ]
    } ), options );
  }
}

waveInterference.register( 'RectangleSceneControlPanel', RectangleSceneControlPanel );
export default RectangleSceneControlPanel;