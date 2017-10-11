// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceModel = require( 'WAVE_INTERFERENCE/common/model/WaveInterferenceModel' );
  var WaveInterferenceScreenView = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceScreenView' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new WaveInterferenceModel(); },
      function( model ) { return new WaveInterferenceScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );