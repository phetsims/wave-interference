// Copyright 2017, University of Colorado Boulder

/**
 * "Slits" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const SlitsScreenModel = require( 'WAVE_INTERFERENCE/slits/model/SlitsScreenModel' );
  const SlitsScreenView = require( 'WAVE_INTERFERENCE/slits/view/SlitsScreenView' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const slitsScreenIcon = require( 'image!WAVE_INTERFERENCE/slits_screen_icon.png' );

  // strings
  const screenSlitsString = require( 'string!WAVE_INTERFERENCE/screen.slits' );

  class SlitsScreen extends Screen {

    /**
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     * @constructor
     */
    constructor( alignGroup ) {
      const options = {
        backgroundColorProperty: new Property( 'white' ),
        name: screenSlitsString,
        homeScreenIcon: new Image( slitsScreenIcon )
      };
      super(
        function() { return new SlitsScreenModel(); },
        function( model ) { return new SlitsScreenView( model, alignGroup ); },
        options
      );
    }
  }

  return waveInterference.register( 'SlitsScreen', SlitsScreen );
} );