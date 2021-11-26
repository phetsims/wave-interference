// Copyright 2017-2020, University of Colorado Boulder

/**
 * "Slits" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import slitsScreenIcon from '../../images/slits_screen_icon_png.js';
import waveInterferenceStrings from '../waveInterferenceStrings.js';
import waveInterference from '../waveInterference.js';
import SlitsModel from './model/SlitsModel.js';
import SlitsScreenView from './view/SlitsScreenView.js';

const screenSlitsString = waveInterferenceStrings.screen.slits;

class SlitsScreen extends Screen {

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   */
  constructor( alignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenSlitsString,
      homeScreenIcon: new ScreenIcon( new Image( slitsScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black'
    };
    super(
      () => new SlitsModel(),
      model => new SlitsScreenView( model, alignGroup ),
      options
    );
  }
}

waveInterference.register( 'SlitsScreen', SlitsScreen );
export default SlitsScreen;