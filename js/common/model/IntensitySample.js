// Copyright 2018, University of Colorado Boulder

/**
 * Keeps track of the history of wave values on the right edge of the visible wave area, for displaying intensity.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var HISTORY_LENGTH = 120; // TODO: increase this?

  /**
   * @constructor
   */
  function IntensitySample( lattice ) {

    // @private
    this.lattice = lattice;

    // @private
    this.history = [];

    // @public {Emitter} - signifies when the intensitySample has changed values.
    this.changedEmitter = new Emitter();
  }

  waveInterference.register( 'IntensitySample', IntensitySample );

  return inherit( Object, IntensitySample, {

    /**
     * Gets the intensity values of the rightmost column in the visible wave area.
     * @returns {number[]}
     * @public
     */
    getIntensityValues: function() {
      var intensities = [];
      for ( var i = 0; i < this.history[ 0 ].length; i++ ) {
        var sum = 0;
        for ( var k = 0; k < this.history.length; k++ ) {
          sum = sum + this.history[ k ][ i ] * this.history[ k ][ i ]; // squared for intensity, see https://physics.info/intensity/
        }
        intensities.push( sum / this.history.length );
      }
      return intensities;
    },

    /**
     * Update the intensity samples when the lattice has updated
     * @public
     */
    step: function() {
      this.history.push( this.lattice.getRightmostColumn() );
      if ( this.history.length > HISTORY_LENGTH ) {
        this.history.shift();
      }
      this.changedEmitter.emit();
    }
  } );
} );