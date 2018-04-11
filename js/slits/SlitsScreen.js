// Copyright 2017, University of Colorado Boulder

/**
 * "Slits" screen in the Wave Interference simulation.
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
  var SlitsScreenModel = require( 'WAVE_INTERFERENCE/slits/model/SlitsScreenModel' );
  var SlitsScreenView = require( 'WAVE_INTERFERENCE/slits/view/SlitsScreenView' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  var slitsScreenIcon = require( 'image!WAVE_INTERFERENCE/slits_screen_icon.png' );

  // strings
  var screenSlitsString = require( 'string!WAVE_INTERFERENCE/screen.slits' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function SlitsScreen( alignGroup ) {
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenSlitsString,
      homeScreenIcon: new Image( slitsScreenIcon )
    };
    Screen.call( this,
      function() { return new SlitsScreenModel(); },
      function( model ) { return new SlitsScreenView( model, alignGroup ); },
      options
    );
  }

  waveInterference.register( 'SlitsScreen', SlitsScreen );

  return inherit( Screen, SlitsScreen );
} );