// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the RectangleScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import RectangleScene from '../model/RectangleScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class RectangleSceneControlPanel extends WaveInterferencePanel {

  public constructor( rectangleScene: RectangleScene, options?: WaveInterferencePanelOptions ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( WaveInterferenceStrings.widthStringProperty, rectangleScene.widthProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ),
        new DiffractionNumberControl( WaveInterferenceStrings.heightStringProperty, rectangleScene.heightProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 20E-3 )
          }
        } ) ]
    } ), options );
  }
}

export default RectangleSceneControlPanel;
