// Copyright 2017-2020, University of Colorado Boulder

/**
 * Screen that just shown the specified medium.  Very similar to WavesScreen.  It creates model and view elements
 * for all scenes, but only shows for the specified scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import waveInterference from '../waveInterference.js';
import BaseScreen from './BaseScreen.js';

class MediumScreen extends BaseScreen {

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @param {Object} [options]
   */
  constructor( alignGroup, options ) {
    options = merge( {
      showSceneRadioButtons: false
    }, options );
    super( alignGroup, options );
  }
}

waveInterference.register( 'MediumScreen', MediumScreen );
export default MediumScreen;