// Copyright 2017-2020, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import interferenceScreenIcon from '../../images/interference_screen_icon_png.js';
import waveInterferenceStrings from '../waveInterferenceStrings.js';
import waveInterference from '../waveInterference.js';
import InterferenceModel from './model/InterferenceModel.js';
import InterferenceScreenView from './view/InterferenceScreenView.js';

const screenInterferenceString = waveInterferenceStrings.screen.interference;

class InterferenceScreen extends Screen {

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   */
  constructor( alignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenInterferenceString,
      homeScreenIcon: new Image( interferenceScreenIcon ),
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