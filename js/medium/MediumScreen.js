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
  const BasicScreen = require( 'WAVE_INTERFERENCE/common/BasicScreen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class MediumScreen extends BasicScreen {

    /**
     * @param {string} medium - the medium to display
     * @param {string} name - the name of the screen
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( medium, name, alignGroup ) {
      super( alignGroup, {
        initialScene: medium,
        name: name,
        showSceneRadioButtons: false
      } );
    }
  }

  return waveInterference.register( 'MediumScreen', MediumScreen );
} );