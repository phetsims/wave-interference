// Copyright 2017-2020, University of Colorado Boulder

/**
 * Base class for WavesScreen and MediumScreen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import waveInterference from '../waveInterference.js';
import WavesModel from '../waves/model/WavesModel.js';
import WavesScreenView from '../waves/view/WavesScreenView.js';

class BaseScreen extends Screen {

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @param {Object} [options]
   */
  constructor( alignGroup, options ) {

    options = merge( {
      backgroundColorProperty: new Property( 'white' ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      showSceneRadioButtons: true,
      showPlaySoundControl: true,
      supportsSound: true
    }, options );

    super(
      () => new WavesModel( options.scenes ? { scenes: options.scenes } : {} ),
      model => new WavesScreenView( model, alignGroup, {
        supportsSound: options.supportsSound,
        showViewpointRadioButtonGroup: true,
        piecewiseLinearBrightness: true,
        lightScreenAveragingWindowSize: 40,

        controlPanelOptions: {

          // The intensity checkbox is not available on BaseScreen instances because it distracts from the other
          // learning goals of the screen
          showIntensityCheckbox: false,
          showSceneRadioButtons: options.showSceneRadioButtons,
          showPlaySoundControl: options.showPlaySoundControl
        }
      } ),
      options
    );
  }
}

waveInterference.register( 'BaseScreen', BaseScreen );
export default BaseScreen;