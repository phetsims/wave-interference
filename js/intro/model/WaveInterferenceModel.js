// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Lattice = require( 'WAVE_INTERFERENCE/intro/model/Lattice' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceModel() {
    var self = this;
    this.lattice = new Lattice( 100, 100, 20, 20, function( i, j ) {
      return i === 60 && ((Math.abs( 40 - j ) > 5) && (Math.abs( 60 - j ) > 5));
    } ); // Java was 60 + 20 padding on each side
    this.time = 0;
    this.phase = 0;

    this.frequencyProperty = new Property( 10 );

    // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
    // for continuity
    this.frequencyProperty.lazyLink( function( newFrequency, oldFrequency ) {
      var oldValue = Math.sin( self.time * oldFrequency + self.phase );
      var proposedPhase = Math.asin( oldValue ) - self.time * newFrequency;
      var oldDerivative = Math.cos( self.time * oldFrequency + self.phase );
      var newDerivative = Math.cos( self.time * newFrequency + proposedPhase );

      // If wrong phase, take the asin value from the opposite side and move forward by half a cycle
      if ( oldDerivative * newDerivative < 0 ) {
        proposedPhase = Math.asin( -oldValue ) - self.time * newFrequency + Math.PI;
      }

      self.phase = proposedPhase;
    } );
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
      var v = Math.sin( this.time * this.frequencyProperty.value + this.phase );
      this.lattice.setCurrentValue( 30, 50, v * 10 );
      this.lattice.step( dt );
    }
  } );
} );