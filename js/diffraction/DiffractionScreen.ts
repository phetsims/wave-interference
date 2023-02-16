// Copyright 2017-2023, University of Colorado Boulder

/**
 * Screen for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import diffraction_screen_icon_png from '../../images/diffraction_screen_icon_png.js';
import waveInterference from '../waveInterference.js';
import WaveInterferenceStrings from '../WaveInterferenceStrings.js';
import DiffractionModel from './model/DiffractionModel.js';
import DiffractionScreenView from './view/DiffractionScreenView.js';

class DiffractionScreen extends Screen<DiffractionModel, DiffractionScreenView> {

  public constructor() {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: WaveInterferenceStrings.screen.diffractionStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( diffraction_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      tandem: Tandem.OPT_OUT
    };

    super(
      () => new DiffractionModel(),
      model => new DiffractionScreenView( model ),
      options
    );
  }
}

waveInterference.register( 'DiffractionScreen', DiffractionScreen );
export default DiffractionScreen;