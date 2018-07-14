// Copyright 2017, University of Colorado Boulder

/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  // images
  const wavesScreenIcon = require( 'image!WAVE_INTERFERENCE/waves_screen_icon.png' );

  // strings
  const screenWavesString = require( 'string!WAVE_INTERFERENCE/screen.waves' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function WavesScreen( alignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenWavesString,
      homeScreenIcon: new Image( wavesScreenIcon )
    };
    Screen.call( this,
      function() { return new WavesScreenModel(); },
      function( model ) {
        return new WavesScreenView( model, alignGroup, {
          showViewRadioButtonGroup: true,

          // The intensity checkbox is not available in the waves screen because it distracts from the learing goals of the screen
          controlPanelOptions: {
            showIntensityCheckbox: false
          }
        } );
      },
      options
    );
  }

  waveInterference.register( 'WavesScreen', WavesScreen );

  return inherit( Screen, WavesScreen );
} );