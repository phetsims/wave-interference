// Copyright 2017-2026, University of Colorado Boulder

/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import AlignGroup from '../../../scenery/js/layout/constraints/AlignGroup.js';
import Image from '../../../scenery/js/nodes/Image.js';
import waves_screen_icon_png from '../../images/waves_screen_icon_png.js';
import BaseScreen, { BaseScreenOptions } from '../common/BaseScreen.js';
import WaveInterferenceStrings from '../WaveInterferenceStrings.js';

class WavesScreen extends BaseScreen {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( alignGroup: AlignGroup ) {
    const options = combineOptions<BaseScreenOptions>( {
      homeScreenIcon: new ScreenIcon( new Image( waves_screen_icon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      name: WaveInterferenceStrings.screen.wavesStringProperty
    } );
    super( alignGroup, options );
  }
}

export default WavesScreen;
