// Copyright 2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var WavesScreen = require( 'WAVE_INTERFERENCE/waves/WavesScreen' );
  var InterferenceScreen = require( 'WAVE_INTERFERENCE/interference/InterferenceScreen' );
  var SlitsScreen = require( 'WAVE_INTERFERENCE/slits/SlitsScreen' );
  var DiffractionScreen = require( 'WAVE_INTERFERENCE/diffraction/DiffractionScreen' );

  // strings
  var waveInterferenceTitleString = require( 'string!WAVE_INTERFERENCE/wave-interference.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( waveInterferenceTitleString, [ new WavesScreen(), new InterferenceScreen(), new SlitsScreen(), new DiffractionScreen() ], simOptions );
    sim.start();
  } );
} );