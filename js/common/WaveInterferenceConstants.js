// Copyright 2018, University of Colorado Boulder

/**
 * Constants for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500 // TODO: Make it so we can update this number and everything reflows
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );