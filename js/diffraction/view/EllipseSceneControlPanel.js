// Copyright 2019-2020, University of Colorado Boulder

/**
 * Control panel for the EllipseScene.
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

const diameterString = waveInterferenceStrings.diameter;
const eccentricityString = waveInterferenceStrings.eccentricity;
const mmValueString = waveInterferenceStrings.mmValue;

class EllipseSceneControlPanel extends WaveInterferencePanel {

  /**
   * @param {EllipseScene} ellipseScene
   * @param {Object} [options]
   */
  constructor( ellipseScene, options ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( diameterString, ellipseScene.diameterProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ),
        new DiffractionNumberControl( eccentricityString, ellipseScene.eccentricityProperty, {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {

            // Constrain by 0.05 but do not exceed the max
            constrainValue: value => Math.min( Utils.roundToInterval( value, 0.05 ), ellipseScene.eccentricityProperty.range.max )
          }
        } )
      ]
    } ), options );
  }
}

waveInterference.register( 'EllipseSceneControlPanel', EllipseSceneControlPanel );
export default EllipseSceneControlPanel;