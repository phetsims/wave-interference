// Copyright 2017, University of Colorado Boulder

/**
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
  var WaveInterferenceModel = require( 'WAVE_INTERFERENCE/common/model/WaveInterferenceModel' );
  var WaveInterferenceScreenView = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceScreenView' );

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
      function() { return new WaveInterferenceModel(); },
      function( model ) { return new WaveInterferenceScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'InterferenceScreen', InterferenceScreen );

  return inherit( Screen, InterferenceScreen );
} );