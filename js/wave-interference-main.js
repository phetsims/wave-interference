// Copyright 2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const DiffractionScreen = require( 'WAVE_INTERFERENCE/diffraction/DiffractionScreen' );
  const InterferenceScreen = require( 'WAVE_INTERFERENCE/interference/InterferenceScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SlitsScreen = require( 'WAVE_INTERFERENCE/slits/SlitsScreen' );
  const WavesScreen = require( 'WAVE_INTERFERENCE/waves/WavesScreen' );

  // strings
  const waveInterferenceTitleString = require( 'string!WAVE_INTERFERENCE/wave-interference.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Sam Reid',
      team: 'Diana López, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton',
      graphicArts: ''
    }
  };

  SimLauncher.launch( () => {

    // Panels on the right side of the lattice (in the first three screens) have matching widths, within each screen and
    // across screens.
    const alignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );
    const sim = new Sim( waveInterferenceTitleString, [ new WavesScreen( alignGroup ), new InterferenceScreen( alignGroup ), new SlitsScreen( alignGroup ), new DiffractionScreen() ], simOptions );
    sim.start();
  } );
} );