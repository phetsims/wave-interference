// Copyright 2017-2022, University of Colorado Boulder

/**
 * Screen that just shown the specified medium.  Very similar to WavesScreen.  It creates model and view elements
 * for all scenes, but only shows for the specified scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../phet-core/js/optionize.js';
import { AlignGroup } from '../../../scenery/js/imports.js';
import waveInterference from '../waveInterference.js';
import BaseScreen, { BaseScreenOptions } from './BaseScreen.js';

class MediumScreen extends BaseScreen {

  /**
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   * @param [options]
   */
  public constructor( alignGroup: AlignGroup, options?: BaseScreenOptions ) {
    options = combineOptions<BaseScreenOptions>( {
      showSceneRadioButtons: false
    }, options );
    super( alignGroup, options );
  }
}

waveInterference.register( 'MediumScreen', MediumScreen );
export default MediumScreen;