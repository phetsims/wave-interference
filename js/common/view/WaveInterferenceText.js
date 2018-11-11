// Copyright 2018, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Text = require( 'SCENERY/nodes/Text' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class WaveInterferenceText extends Text {

    /**
     * @param {string} string
     * @param {Object} [options]
     */
    constructor( string, options ) {
      super( string, _.extend( {
        font: WaveInterferenceConstants.DEFAULT_FONT
      }, options ) );
    }
  }

  return waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
} );