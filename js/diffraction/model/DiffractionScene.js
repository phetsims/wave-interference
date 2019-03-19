// Copyright 2019, University of Colorado Boulder

/**
 * Base type for Scenes in the diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionScene {

    constructor() {

      // @public (read-only) {Property.<*>[]} - set by subclasses
      this.properties = null;
    }

    /**
     * Restore the initial values for all Property instances.
     * @public
     */
    reset() {
      this.properties.forEach( property => property.reset() );
    }

    /**
     * Link to each Property instance
     * @param {function} listener
     */
    link( listener ) {
      this.properties.forEach( property => property.link( listener ) );
    }
  }

  return waveInterference.register( 'DiffractionScene', DiffractionScene );
} );