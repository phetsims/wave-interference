// Copyright 2018, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Text = require( 'SCENERY/nodes/Text' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceText extends Text {

    /**
     * @param {string} string
     * @param {Object} [options]
     */
    constructor( string, options ) {
      super( string, _.extend( { fontSize: 12 }, options ) );
    }
  }

  return waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
} );