// Copyright 2017-2019, University of Colorado Boulder

/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BaseScreen = require( 'WAVE_INTERFERENCE/common/BaseScreen' );
  const Image = require( 'SCENERY/nodes/Image' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const wavesScreenIcon = require( 'image!WAVE_INTERFERENCE/waves_screen_icon.png' );

  // strings
  const screenWavesString = require( 'string!WAVE_INTERFERENCE/screen.waves' );

  class WavesScreen extends BaseScreen {

    /**
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( alignGroup ) {
      const options = {
        homeScreenIcon: new Image( wavesScreenIcon ),
        name: screenWavesString
      };
      super( alignGroup, options );
    }
  }

  return waveInterference.register( 'WavesScreen', WavesScreen );
} );