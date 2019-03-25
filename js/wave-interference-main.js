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
  const DiffractionScreen = require( 'WAVE_INTERFERENCE/diffraction/DiffractionScreen' );
  const InterferenceScreen = require( 'WAVE_INTERFERENCE/interference/InterferenceScreen' );
  const MediumScreen = require( 'WAVE_INTERFERENCE/medium/MediumScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SlitsScreen = require( 'WAVE_INTERFERENCE/slits/SlitsScreen' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );
  const WavesScreen = require( 'WAVE_INTERFERENCE/waves/WavesScreen' );

  // strings
  const waveInterferenceTitleString = require( 'string!WAVE_INTERFERENCE/wave-interference.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Noah Podolefsky',
      softwareDevelopment: 'Sam Reid',
      team: 'Wendy Adams, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Katie Woessner',
      qualityAssurance: 'Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Katie Woessner, Kelly Wurtz',
      graphicArts: 'Cheryl McCutchan',
      thanks: 'Thanks to the STROBE NSF Science and Technology Center on Real-Time Functional Imaging for their support.'
    }
  };

  SimLauncher.launch( () => {

    // Panels on the right side of the lattice (in the first three screens) have matching widths, within each screen and
    // across screens.
    const alignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );

    // TODO: Remove this when we have a repo, see https://github.com/phetsims/wave-interference/issues/357
    const screens = WaveInterferenceQueryParameters.mediumScreens ? [
      new MediumScreen( 'waterScene', 'Water', alignGroup ),
      new MediumScreen( 'soundScene', 'Sound', alignGroup ),
      new MediumScreen( 'lightScene', 'Light', alignGroup )
    ] : [
      new WavesScreen( alignGroup ),
      new InterferenceScreen( alignGroup ),
      new SlitsScreen( alignGroup ),
      new DiffractionScreen()
    ];
    const sim = new Sim( waveInterferenceTitleString, screens, simOptions );
    sim.start();
  } );
} );
