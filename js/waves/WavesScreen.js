// Copyright 2017, University of Colorado Boulder

/**
 * "Waves" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/common/model/WavesScreenModel' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/common/view/WavesScreenView' );

  // images
  var wavesScreenIcon = require( 'image!WAVE_INTERFERENCE/waves_screen_icon.png' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function WavesScreen( alignGroup ) {
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: 'Waves',
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