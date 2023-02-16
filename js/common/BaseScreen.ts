// Copyright 2017-2023, University of Colorado Boulder

/**
 * Base class for WavesScreen and MediumScreen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import { AlignGroup } from '../../../scenery/js/imports.js';
import waveInterference from '../waveInterference.js';
import WavesModel from '../waves/model/WavesModel.js';
import WavesScreenView from '../waves/view/WavesScreenView.js';

type SelfOptions = {
  showSceneRadioButtons?: boolean;
  showPlaySoundControl?: boolean;
  audioEnabled?: boolean;
  scenes: ( 'waterScene' | 'soundScene' | 'lightScene' )[];
};
export type BaseScreenOptions = SelfOptions & ScreenOptions;

class BaseScreen extends Screen<WavesModel, WavesScreenView> {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   * @param [providedOptions]
   */
  public constructor( alignGroup: AlignGroup, providedOptions?: BaseScreenOptions ) {

    const options = optionize<BaseScreenOptions, SelfOptions, ScreenOptions>()( {
      backgroundColorProperty: new Property( 'white' ),
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      showSceneRadioButtons: true,
      showPlaySoundControl: true,
      audioEnabled: true
    }, providedOptions );

    super(
      () => new WavesModel( options.scenes ? { scenes: options.scenes } : {} ),
      model => new WavesScreenView( model, alignGroup, {
        audioEnabled: options.audioEnabled,
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