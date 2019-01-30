// Copyright 2017-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const InterferenceScreen = require( 'WAVE_INTERFERENCE/interference/InterferenceScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SlitsScreen = require( 'WAVE_INTERFERENCE/slits/SlitsScreen' );
  const WavesScreen = require( 'WAVE_INTERFERENCE/waves/WavesScreen' );

  // strings
  const waveInterferenceTitleString = require( 'string!WAVE_INTERFERENCE/wave-interference.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Noah Podolefsky',
      softwareDevelopment: 'Sam Reid',
      team: 'Wendy Adams, Ariel Paul, Kathy Perkins, Diana L\u00f3pez Tavares, Katie Woessner',
      qualityAssurance: 'Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Katie Woessner, Kelly Wurtz',
      graphicArts: 'Cheryl McCutchan'
    }
  };

  SimLauncher.launch( () => {

    // Panels on the right side of the lattice (in the first three screens) have matching widths, within each screen and
    // across screens.
    const alignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );

    const sim = new Sim( waveInterferenceTitleString, [
      new WavesScreen( alignGroup ),
      new InterferenceScreen( alignGroup ),
      new SlitsScreen( alignGroup )
    ], simOptions );
    sim.start();
  } );
} );
