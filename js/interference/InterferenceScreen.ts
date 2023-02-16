// Copyright 2017-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { AlignGroup, Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import interference_screen_icon_png from '../../images/interference_screen_icon_png.js';
import waveInterference from '../waveInterference.js';
import WaveInterferenceStrings from '../WaveInterferenceStrings.js';
import InterferenceModel from './model/InterferenceModel.js';
import InterferenceScreenView from './view/InterferenceScreenView.js';

class InterferenceScreen extends Screen<InterferenceModel, InterferenceScreenView> {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( alignGroup: AlignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: WaveInterferenceStrings.screen.interferenceStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( interference_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      tandem: Tandem.OPT_OUT
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