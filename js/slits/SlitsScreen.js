// Copyright 2017, University of Colorado Boulder

/**
 * "Slits" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var SlitsScreenModel = require( 'WAVE_INTERFERENCE/slits/model/SlitsScreenModel' );
  var SlitsScreenView = require( 'WAVE_INTERFERENCE/slits/view/SlitsScreenView' );

  /**
   * @constructor
   */
  function SlitsScreen() {
    var homeScreenIcon = Rectangle.dimension( Screen.MINIMUM_HOME_SCREEN_ICON_SIZE, {
      fill: 'white'
    } );
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: 'Slits',
      homeScreenIcon: homeScreenIcon
    };
    Screen.call( this,
      function() { return new SlitsScreenModel(); },
      function( model ) { return new SlitsScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'SlitsScreen', SlitsScreen );

  return inherit( Screen, SlitsScreen );
} );