// Copyright 2018, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {string} string
   * @param {Object} [options]
   * @constructor
   */
  function WaveInterferenceText( string, options ) {
    Text.call( this, string, _.extend( { fontSize: 16 }, options ) );
  }

  waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );

  return inherit( Text, WaveInterferenceText );
} );