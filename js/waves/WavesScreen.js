// Copyright 2017-2020, University of Colorado Boulder

/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import wavesScreenIcon from '../../images/waves_screen_icon_png.js';
import BaseScreen from '../common/BaseScreen.js';
import waveInterferenceStrings from '../waveInterferenceStrings.js';
import waveInterference from '../waveInterference.js';

const screenWavesString = waveInterferenceStrings.screen.waves;

class WavesScreen extends BaseScreen {

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   */
  constructor( alignGroup ) {
    const options = {
      homeScreenIcon: new ScreenIcon( new Image( wavesScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      name: screenWavesString
    };
    super( alignGroup, options );
  }
}

waveInterference.register( 'WavesScreen', WavesScreen );
export default WavesScreen;