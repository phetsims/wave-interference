// Copyright 2018, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Text = require( 'SCENERY/nodes/Text' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {string} string
   * @param {Object} [options]
   * @constructor
   */
  function WaveInterferenceText( string, options ) {
    Text.call( this, string, _.extend( { fontSize: 12 }, options ) );
  }

  waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );

  return inherit( Text, WaveInterferenceText );
} );