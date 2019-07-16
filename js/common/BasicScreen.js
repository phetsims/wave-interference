// Copyright 2017-2019, University of Colorado Boulder

/**
 * Base class for WavesScreen and MediumScreen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  class BasicScreen extends Screen {

    /**
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     * @param {Object} [options]
     */
    constructor( alignGroup, options ) {

      options = _.extend( {
        backgroundColorProperty: new Property( 'white' ),
        showUnselectedHomeScreenIconFrame: true,
        showScreenIconFrameForNavigationBarFill: 'black',
        showSceneRadioButtons: true,
        initialScene: null,
        showPlaySoundControl: true,
        supportsSound: true
      }, options );

      assert && assert( options.initialScene, 'initial scene should be specified' );

      super(
        () => new WavesModel( options.initialScene ? { initialScene: options.initialScene } : {} ),
        model => new WavesScreenView( model, alignGroup, {
          supportsSound: options.supportsSound,
          showViewpointRadioButtonGroup: true,
          piecewiseLinearBrightness: true,
          lightScreenAveragingWindowSize: 40,

          controlPanelOptions: {

            // The intensity checkbox is not available on BasicScreen instances because it distracts from the other
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

  return waveInterference.register( 'BasicScreen', BasicScreen );
} );