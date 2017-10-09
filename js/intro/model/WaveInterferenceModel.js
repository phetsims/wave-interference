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
    this.lattice = new Lattice( 100, 100 ); // Java was 60 + 20 padding on each side
    this.time = 0;
  }

  waveInterference.register( 'WaveInterferenceModel', WaveInterferenceModel );

  return inherit( Object, WaveInterferenceModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    // @public
    step: function( dt ) {
      dt = 1 / 60; // TODO: how to support slower machines?
      this.time += dt;
      this.lattice.setCurrentValue( 30, 50, Math.sin( this.time * 10 ) * 10 );
      this.lattice.step( dt );
    }
  } );
} );