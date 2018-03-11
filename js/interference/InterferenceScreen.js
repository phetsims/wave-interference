// Copyright 2017, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
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
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/common/model/WavesScreenModel' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/common/view/WavesScreenView' );

  /**
   * @constructor
   */
  function InterferenceScreen() {
    var homeScreenIcon = Rectangle.dimension( Screen.MINIMUM_HOME_SCREEN_ICON_SIZE, {
      fill: 'white'
    } );
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: 'Interference',
      homeScreenIcon: homeScreenIcon
    };
    Screen.call( this,
      function() { return new WavesScreenModel(); },
      function( model ) { return new WavesScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'InterferenceScreen', InterferenceScreen );

  return inherit( Screen, InterferenceScreen );
} );