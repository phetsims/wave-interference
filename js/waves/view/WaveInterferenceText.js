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
   * @constructor
   */
  function WaveInterferenceText( string ) {
    Text.call( this, string, { fontSize: 16 } );
  }

  waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );

  return inherit( Text, WaveInterferenceText );
} );