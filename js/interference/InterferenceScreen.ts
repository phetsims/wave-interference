// Copyright 2017-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import interference_screen_icon_png from '../../images/interference_screen_icon_png.js';
import waveInterference from '../waveInterference.js';
import waveInterferenceStrings from '../waveInterferenceStrings.js';
import InterferenceModel from './model/InterferenceModel.js';
import InterferenceScreenView from './view/InterferenceScreenView.js';

const screenInterferenceString = waveInterferenceStrings.screen.interference;

class InterferenceScreen extends Screen {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  constructor( alignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenInterferenceString,
      homeScreenIcon: new ScreenIcon( new Image( interference_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black'
    };
    super(
      () => new InterferenceModel(),
      model => new InterferenceScreenView( model, alignGroup ),
      options
    );
  }
}

waveInterference.register( 'InterferenceScreen', InterferenceScreen );
export default InterferenceScreen;