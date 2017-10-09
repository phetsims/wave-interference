// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var Lattice = require( 'WAVE_INTERFERENCE/intro/model/Lattice' );

  /**
   * @constructor
   */
  function WaveInterferenceModel() {
    this.lattice = new Lattice( 60, 60 );
  }

  waveInterference.register( 'WaveInterferenceModel', WaveInterferenceModel );

  return inherit( Object, WaveInterferenceModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    // @public
    step: function( dt ) {
      this.lattice.setCurrentValue( 10, 10, Math.sin( Date.now() / 1000 * 2 ) * 10 );
      this.lattice.step( dt );
    }
  } );
} );