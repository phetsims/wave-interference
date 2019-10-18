// Copyright 2018-2019, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Text = require( 'SCENERY/nodes/Text' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class WaveInterferenceText extends Text {

    /**
     * @param {string} string
     * @param {Object} [options]
     */
    constructor( string, options ) {
      super( string, merge( {
        font: WaveInterferenceConstants.DEFAULT_FONT,

        // This addresses numerous cases where `maxWidth: 120` would have to otherwise be set in client code.
        maxWidth: 120
      }, options ) );
    }
  }

  return waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
} );