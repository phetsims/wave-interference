// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the EllipseScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import EllipseScene from '../model/EllipseScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class EllipseSceneControlPanel extends WaveInterferencePanel {

  public constructor( ellipseScene: EllipseScene, options?: WaveInterferencePanelOptions ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( WaveInterferenceStrings.diameterStringProperty, ellipseScene.diameterProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => roundToInterval( value, 20E-3 )
          }
        } ),
        new DiffractionNumberControl( WaveInterferenceStrings.eccentricityStringProperty, ellipseScene.eccentricityProperty, {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {

            // Constrain by 0.05 but do not exceed the max
            constrainValue: value => Math.min( roundToInterval( value, 0.05 ), ellipseScene.eccentricityProperty.range.max )
          }
        } )
      ]
    } ), options );
  }
}

export default EllipseSceneControlPanel;
