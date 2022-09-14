// Copyright 2017-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import waves_screen_icon_png from '../../images/waves_screen_icon_png.js';
import BaseScreen from '../common/BaseScreen.js';
import waveInterference from '../waveInterference.js';
import WaveInterferenceStrings from '../WaveInterferenceStrings.js';

class WavesScreen extends BaseScreen {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( alignGroup ) {
    const options = {
      homeScreenIcon: new ScreenIcon( new Image( waves_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      name: WaveInterferenceStrings.screen.wavesStringProperty
    };
    super( alignGroup, options );
  }
}

waveInterference.register( 'WavesScreen', WavesScreen );
export default WavesScreen;