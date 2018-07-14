// Copyright 2018, University of Colorado Boulder

/**
 * Keeps track of the history of wave values on the right edge of the visible wave area, for displaying intensity in
 * the ScreenNode and IntensityGraphPanel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  // Number of samples to use for a temporal average.  Higher number means more latency. Lower number means more
  // responsive, but we need to make the time longer than one period so it doesn't just show part of the wave cycle
  const HISTORY_LENGTH = 120;

  class IntensitySample {

    /**
     * @param {Lattice} lattice
     */
    constructor( lattice ) {

      // @private {Lattice}
      this.lattice = lattice;

      // @private {Array.<Array.<number>>} - each element is one output column
      this.history = [ this.lattice.getOutputColumn() ];

      // @public {Emitter} - signifies when the intensitySample has changed values.
      this.changedEmitter = new Emitter();
    }


    /**
     * Gets the intensity values of the rightmost column in the visible wave area.
     * @returns {number[]}
     * @public
     */
    getIntensityValues() {
      const intensities = [];
      for ( let i = 0; i < this.history[ 0 ].length; i++ ) {
        let sum = 0;
        for ( let k = 0; k < this.history.length; k++ ) {
          sum = sum + this.history[ k ][ i ] * this.history[ k ][ i ]; // squared for intensity, see https://physics.info/intensity/
        }
        intensities.push( sum / this.history.length );
      }
      return intensities;
    }

    /**
     * Removes all data, used when resetting or changing scenes.
     * @public
     */
    clear() {
      this.history.length = 0;
      this.history.push( this.lattice.getOutputColumn() );
      this.changedEmitter.emit();
    }

    /**
     * Update the intensity samples when the lattice has updated.
     * @public
     */
    step() {
      this.history.push( this.lattice.getOutputColumn() );
      if ( this.history.length > HISTORY_LENGTH ) {
        this.history.shift();
      }
      this.changedEmitter.emit();
    }
  }

  waveInterference.register( 'IntensitySample', IntensitySample );

  return IntensitySample;
} );