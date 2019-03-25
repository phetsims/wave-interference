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
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  // images
  const wavesScreenIcon = require( 'image!WAVE_INTERFERENCE/waves_screen_icon.png' );

  class MediumScreen extends Screen {

    /**
     * @param {string} medium - the medium to display
     * @param {string} name - the name of the screen
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( medium, name, alignGroup ) {
      const options = {
        backgroundColorProperty: new Property( 'white' ),
        name: name,
        homeScreenIcon: new Image( wavesScreenIcon ),
        showUnselectedHomeScreenIconFrame: true,
        showScreenIconFrameForNavigationBarFill: 'black'
      };
      super(
        () => new WavesModel( { initialScene: medium } ),
        model => new WavesScreenView( model, alignGroup, {
          showViewpointRadioButtonGroup: true,

          lightScreenNodeBrightness: 1.85,

          // The intensity checkbox is not available in the waves screen because it distracts from the learning goals of the screen
          controlPanelOptions: {
            showIntensityCheckbox: false,
            showSceneRadioButtons: false
          }
        } ),
        options
      );
    }
  }

  return waveInterference.register( 'MediumScreen', MediumScreen );
} );