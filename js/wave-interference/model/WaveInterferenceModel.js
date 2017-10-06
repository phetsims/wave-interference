// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceModel() {
    //TODO
  }

  waveInterference.register( 'WaveInterferenceModel', WaveInterferenceModel );

  return inherit( Object, WaveInterferenceModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );