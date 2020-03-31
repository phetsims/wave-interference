// Copyright 2019-2020, University of Colorado Boulder

/**
 * Control panel for the DisorderScene.
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

const circleDiameterString = waveInterferenceStrings.circleDiameter;
const disorderString = waveInterferenceStrings.disorder;
const latticeSpacingString = waveInterferenceStrings.latticeSpacing;
const lotsString = waveInterferenceStrings.lots;
const mmValueString = waveInterferenceStrings.mmValue;
const noneString = waveInterferenceStrings.none;

class DisorderSceneControlPanel extends WaveInterferencePanel {

  /**
   * @param {DisorderScene} disorderScene
   * @param {Object} [options]
   */
  constructor( disorderScene, options ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( circleDiameterString, disorderScene.diameterProperty, {
          delta: 10E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10E-3 )
          }
        } ),
        new DiffractionNumberControl( latticeSpacingString, disorderScene.latticeSpacingProperty, {
          delta: 10E-3,
          numberDisplayOptions: {
            valuePattern: mmValueString,
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10E-3 )
          }
        } ),
        new DiffractionNumberControl( disorderString, disorderScene.disorderProperty, {
          numberDisplayOptions: {
            visible: false
          },
          sliderOptions: {
            majorTicks: [ {
              value: disorderScene.disorderProperty.range.min,
              label: new WaveInterferenceText( noneString, { maxWidth: 60 } )
            }, {
              value: disorderScene.disorderProperty.range.max,
              label: new WaveInterferenceText( lotsString, { maxWidth: 60 } )
            } ],
            minorTickSpacing: 1
          }
        } )
      ]
    } ), options );
  }
}

waveInterference.register( 'DisorderSceneControlPanel', DisorderSceneControlPanel );
export default DisorderSceneControlPanel;