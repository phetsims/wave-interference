// Copyright 2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var DiffractionScreen = require( 'WAVE_INTERFERENCE/diffraction/DiffractionScreen' );
  var InterferenceScreen = require( 'WAVE_INTERFERENCE/interference/InterferenceScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SlitsScreen = require( 'WAVE_INTERFERENCE/slits/SlitsScreen' );
  var WavesScreen = require( 'WAVE_INTERFERENCE/waves/WavesScreen' );

  // strings
  var waveInterferenceTitleString = require( 'string!WAVE_INTERFERENCE/wave-interference.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Sam Reid',
      team: 'Diana López, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton', // TODO(pre-publication): QA credits
      graphicArts: '' // TODO(pre-publication): Graphic arts credits
    }
  };

  SimLauncher.launch( function() {

    // Panels on the right side of the lattice (in the first three screens) have matching widths, within each screen and
    // across screens.
    var alignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );
    var sim = new Sim( waveInterferenceTitleString, [ new WavesScreen( alignGroup ), new InterferenceScreen( alignGroup ), new SlitsScreen( alignGroup ), new DiffractionScreen() ], simOptions );
    sim.start();
  } );
} );