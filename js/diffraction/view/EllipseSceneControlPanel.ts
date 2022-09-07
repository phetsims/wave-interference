// Copyright 2019-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Control panel for the EllipseScene.
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

const diameterString = WaveInterferenceStrings.diameter;
const eccentricityString = WaveInterferenceStrings.eccentricity;
const mmValueString = WaveInterferenceStrings.mmValue;

class EllipseSceneControlPanel extends WaveInterferencePanel {

  public constructor( ellipseScene, options ) {
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