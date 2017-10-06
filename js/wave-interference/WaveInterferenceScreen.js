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
  var WaveInterferenceModel = require( 'WAVE_INTERFERENCE/wave-interference/model/WaveInterferenceModel' );
  var WaveInterferenceScreenView = require( 'WAVE_INTERFERENCE/wave-interference/view/WaveInterferenceScreenView' );

  /**
   * @constructor
   */
  function WaveInterferenceScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new WaveInterferenceModel(); },
      function( model ) { return new WaveInterferenceScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'WaveInterferenceScreen', WaveInterferenceScreen );

  return inherit( Screen, WaveInterferenceScreen );
} );