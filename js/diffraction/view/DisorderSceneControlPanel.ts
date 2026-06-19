// Copyright 2019-2026, University of Colorado Boulder

/**
 * Control panel for the DisorderScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import WaveInterferencePanel, { WaveInterferencePanelOptions } from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import DisorderScene from '../model/DisorderScene.js';
import DiffractionNumberControl from './DiffractionNumberControl.js';

class DisorderSceneControlPanel extends WaveInterferencePanel {

  public constructor( disorderScene: DisorderScene, options?: WaveInterferencePanelOptions ) {
    super( new HBox( {
      spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
      align: 'bottom',
      children: [
        new DiffractionNumberControl( WaveInterferenceStrings.circleDiameterStringProperty, disorderScene.diameterProperty, {
          delta: 10E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10E-3 )
          }
        } ),
        new DiffractionNumberControl( WaveInterferenceStrings.latticeSpacingStringProperty, disorderScene.latticeSpacingProperty, {
          delta: 10E-3,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          sliderOptions: {
            constrainValue: value => Utils.roundToInterval( value, 10E-3 )
          }
        } ),
        new DiffractionNumberControl( WaveInterferenceStrings.disorderStringProperty, disorderScene.disorderProperty, {
          numberDisplayOptions: {
            visible: false
          },
          sliderOptions: {
            majorTicks: [ {
              value: disorderScene.disorderProperty.range.min,
              label: new WaveInterferenceText( WaveInterferenceStrings.noneStringProperty, { maxWidth: 60 } )
            }, {
              value: disorderScene.disorderProperty.range.max,
              label: new WaveInterferenceText( WaveInterferenceStrings.lotsStringProperty, { maxWidth: 60 } )
            } ],
            minorTickSpacing: 1
          }
        } )
      ]
    } ), options );
  }
}

export default DisorderSceneControlPanel;
