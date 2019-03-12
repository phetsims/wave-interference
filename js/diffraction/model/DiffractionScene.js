// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DiffractionScene {

    /**
     * @param {Object} [options]
     */
    constructor( properties, options ) {

      // @private
      this.properties = properties; // TODO: set properties after constructor to simplify clients
    }

    reset() {
      this.properties.forEach( property => property.reset() );
    }

    link( listener ) {
      this.properties.forEach( property => property.link( listener ) );
    }
  }

  return waveInterference.register( 'DiffractionScene', DiffractionScene );
} );