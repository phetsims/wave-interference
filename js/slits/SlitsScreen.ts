// Copyright 2017-2023, University of Colorado Boulder

/**
 * "Slits" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { AlignGroup, Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import slits_screen_icon_png from '../../images/slits_screen_icon_png.js';
import waveInterference from '../waveInterference.js';
import WaveInterferenceStrings from '../WaveInterferenceStrings.js';
import SlitsModel from './model/SlitsModel.js';
import SlitsScreenView from './view/SlitsScreenView.js';

class SlitsScreen extends Screen<SlitsModel, SlitsScreenView> {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( alignGroup: AlignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: WaveInterferenceStrings.screen.slitsStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( slits_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      tandem: Tandem.OPT_OUT
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