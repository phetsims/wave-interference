// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the RectangleScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import RectangleScene from '../model/RectangleScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class RectangleSceneControlPanel extends WaveInterferencePanel {

  public constructor( rectangleScene: RectangleScene, options?: WaveInterferencePanelOptions ) {

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 0.02 mm).
    const widthControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.widthStringProperty, rectangleScene.widthProperty, {
      delta: 10 * 1E-3,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {
        constrainValue: value => roundToInterval( value, widthControl.slider.shiftKeyDown ? 10E-3 : 20E-3 )
      }
    } );

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 0.02 mm).
    const heightControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.heightStringProperty, rectangleScene.heightProperty, {
      delta: 10 * 1E-3,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {
        constrainValue: value => roundToInterval( value, heightControl.slider.shiftKeyDown ? 10E-3 : 20E-3 )
      }
    } );

    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [ widthControl, heightControl ]
    } ), options );
  }
}

export default RectangleSceneControlPanel;
