// Copyright 2017-2021, University of Colorado Boulder

/**
 * Screen for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import diffraction_screen_icon_png from '../../images/diffraction_screen_icon_png.js';
import waveInterference from '../waveInterference.js';
import waveInterferenceStrings from '../waveInterferenceStrings.js';
import DiffractionModel from './model/DiffractionModel.js';
import DiffractionScreenView from './view/DiffractionScreenView.js';

const screenDiffractionString = waveInterferenceStrings.screen.diffraction;

class DiffractionScreen extends Screen {

  constructor() {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenDiffractionString,
      homeScreenIcon: new ScreenIcon( new Image( diffraction_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black'
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