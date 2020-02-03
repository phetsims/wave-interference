// Copyright 2017-2019, University of Colorado Boulder

/**
 * Screen that just shown the specified medium.  Very similar to WavesScreen.  It creates model and view elements
 * for all scenes, but only shows for the specified scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BaseScreen = require( 'WAVE_INTERFERENCE/common/BaseScreen' );
  const merge = require( 'PHET_CORE/merge' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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

  return waveInterference.register( 'MediumScreen', MediumScreen );
} );