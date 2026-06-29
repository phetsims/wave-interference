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

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 0.02 mm).
    const diameterControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.diameterStringProperty, ellipseScene.diameterProperty, {
      delta: 10 * 1E-3,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {
        constrainValue: value => roundToInterval( value, diameterControl.slider.shiftKeyDown ? 10E-3 : 20E-3 )
      }
    } );

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 0.05).
    const eccentricityControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.eccentricityStringProperty, ellipseScene.eccentricityProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {

        // Constrain by 0.05 (0.01 while Shift is held) but do not exceed the max
        constrainValue: value => Math.min( roundToInterval( value, eccentricityControl.slider.shiftKeyDown ? 0.01 : 0.05 ), ellipseScene.eccentricityProperty.range.max )
      }
    } );

    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [ diameterControl, eccentricityControl ]
    } ), options );
  }
}

export default EllipseSceneControlPanel;
