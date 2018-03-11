// Copyright 2017, University of Colorado Boulder

/**
 * Base class model for all Wave Interference screen models.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceModel() {
    var self = this;

    // @public
    var potential = function( i, j ) {
      return false;
      // return i === 60 && ((Math.abs( 40 - j ) > 3) && (Math.abs( 60 - j ) > 3));
    };

    // @public {Lattice} the grid that contains the wave values
    this.lattice = new Lattice( 100, 100, 20, 20, potential ); // Java was 60 + 20 padding on each side

    // @public {number} elapsed time in seconds
    this.time = 0;

    // @public {number} phase of the emitter
    this.phase = 0;

    // @public {NumberProperty} the frequency of the emitter
    this.frequencyProperty = new NumberProperty( 20 );

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

    // @public {NumberProperty} controls the amplitude of the wave
    this.amplitudeProperty = new NumberProperty( 10 );
  }

  waveInterference.register( 'WaveInterferenceModel', WaveInterferenceModel );

  return inherit( Object, WaveInterferenceModel, {

    // @public resets the model
    reset: function() {

      // Reset frequencyProperty first because it changes the time and phase.
      this.frequencyProperty.reset();

      this.time = 0;
      this.phase = 0;

      this.lattice.clear();
    },

    // @public
    step: function( dt ) {
      dt = 1 / 60; // TODO: how to support slower machines?
      this.time += dt;
      var v = Math.sin( this.time * this.frequencyProperty.value + this.phase ) * this.amplitudeProperty.get();
      this.lattice.setCurrentValue( 30, 50, v );
      this.lattice.step( dt );
    }
  } );
} );