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
        showPlaySoundButton: false
      }, options );
      super(
        () => new WavesModel( options.initialScene ? { initialScene: options.initialScene } : {} ),
        model => new WavesScreenView( model, alignGroup, {
          showViewpointRadioButtonGroup: true,
          piecewiseLinearBrightness: true,
          lightScreenAveragingWindowSize: 40,

          // The intensity checkbox is not available in the waves screen because it distracts from the learning goals of the screen
          controlPanelOptions: {
            showIntensityCheckbox: false,
            showSceneRadioButtons: options.showSceneRadioButtons,
            showPlaySoundButton: options.showPlaySoundButton
          }
        } ),
        options
      );
    }
  }

  return waveInterference.register( 'BasicScreen', BasicScreen );
} );