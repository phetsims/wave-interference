// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the WavingGirlScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavingGirlScene from '../model/WavingGirlScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class WavingGirlSceneControlPanel extends WaveInterferencePanel {

  public constructor( wavingGirlScene: WavingGirlScene, options?: WaveInterferencePanelOptions ) {

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 0.02 mm).
    const heightControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.heightStringProperty, wavingGirlScene.heightProperty, {
      delta: 10 * 1E-3,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {
        constrainValue: value => roundToInterval( value, heightControl.slider.shiftKeyDown ? 10E-3 : 20E-3 )
      }
    } );

    // Captured so constrainValue can snap finer while Shift is held (keeping mouse/arrow snapping at 30 degrees).
    const rotationControl: DiffractionNumberControl = new DiffractionNumberControl( WaveInterferenceStrings.rotationStringProperty, wavingGirlScene.rotationProperty, {
      numberDisplayOptions: {
        valuePattern: WaveInterferenceStrings.degreesValueStringProperty
      },
      sliderOptions: {

        // degrees: 30 normally, 1 with Shift
        constrainValue: value => roundToInterval( value, rotationControl.slider.shiftKeyDown ? 1 : 30 ),
        majorTicks: [ {
          value: wavingGirlScene.rotationProperty.range.min,
          label: new WaveInterferenceText( wavingGirlScene.rotationProperty.range.min )
        }, {
          value: wavingGirlScene.rotationProperty.range.max,
          label: new WaveInterferenceText( '360' )
        } ]
      }
    } );

    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [ heightControl, rotationControl ]
    } ), options );
  }
}

export default WavingGirlSceneControlPanel;
