// Copyright 2019-2020, University of Colorado Boulder

/**
 * Control panel for the RectangleScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import WaveInterferencePanel from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import waveInterference from '../../waveInterference.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

const heightString = waveInterferenceStrings.height;
const mmValueString = waveInterferenceStrings.mmValue;
const widthString = waveInterferenceStrings.width;

class RectangleSceneControlPanel extends WaveInterferencePanel {

  /**
   * @param {RectangleScene} rectangleScene
   * @param {Object} [options]
   */
  constructor( rectangleScene, options ) {
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