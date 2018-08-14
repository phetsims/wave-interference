// Copyright 2017-2018, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const InterferenceScreenModel = require( 'WAVE_INTERFERENCE/interference/model/InterferenceScreenModel' );
  const InterferenceScreenView = require( 'WAVE_INTERFERENCE/interference/view/InterferenceScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const interferenceScreenIcon = require( 'image!WAVE_INTERFERENCE/interference_screen_icon.png' );

  // strings
  const screenInterferenceString = require( 'string!WAVE_INTERFERENCE/screen.interference' );

  class InterferenceScreen extends Screen {

    /**
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( alignGroup ) {
      const options = {
        backgroundColorProperty: new Property( 'white' ),
        name: screenInterferenceString,
        homeScreenIcon: new Image( interferenceScreenIcon )
      };
      super(
        () => new InterferenceScreenModel(),
        model => new InterferenceScreenView( model, alignGroup ),
        options
      );
    }
  }

  return waveInterference.register( 'InterferenceScreen', InterferenceScreen );
} );