// Copyright 2017-2018, University of Colorado Boulder

/**
 * Screen for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionModel = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionModel' );
  const DiffractionScreenView = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const diffractionScreenIcon = require( 'image!WAVE_INTERFERENCE/diffraction_screen_icon.png' );

  // strings
  const screenDiffractionString = require( 'string!WAVE_INTERFERENCE/screen.diffraction' );

  class DiffractionScreen extends Screen {

    constructor() {
      const options = {
        backgroundColorProperty: new Property( 'white' ),
        name: screenDiffractionString,
        homeScreenIcon: new Image( diffractionScreenIcon ),
        showUnselectedHomeScreenIconFrame: true,
        showScreenIconFrameForNavigationBarFill: 'black'
      };

      super(
        () => new DiffractionModel(),
        model => new DiffractionScreenView( model ),
        options
      );
    }
  }

  return waveInterference.register( 'DiffractionScreen', DiffractionScreen );
} );