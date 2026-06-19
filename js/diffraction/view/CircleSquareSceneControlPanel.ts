// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the CircleSquareScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import CircleSquareScene from '../model/CircleSquareScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class CircleSquareSceneControlPanel extends WaveInterferencePanel {

  public constructor( circleSquareScene: CircleSquareScene, options?: WaveInterferencePanelOptions ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( WaveInterferenceStrings.circleDiameterStringProperty, circleSquareScene.circleDiameterProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10 * 1E-3 )
          }
        } ),
        new DiffractionNumberControl( WaveInterferenceStrings.squareWidthStringProperty, circleSquareScene.squareWidthProperty, {
          delta: 10 * 1E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10 * 1E-3 )
          }
        } )
      ]
    } ), options );
  }
}

export default CircleSquareSceneControlPanel;
