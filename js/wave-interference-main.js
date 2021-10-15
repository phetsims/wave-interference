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
  const platform = require( 'PHET_CORE/platform' );
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
      team: 'Wendy Adams, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Katie Woessner',
      qualityAssurance: 'Logan Bray, Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Katie Woessner, Kelly Wurtz',
      graphicArts: 'Cheryl McCutchan',
      thanks: 'We gratefully acknowledge support from STROBE NSF Science & Technology Center Grant DMR-1548924. Any ' +
              'opinions, findings, and conclusions or recommendations expressed in this material are those of the authors ' +
              'and do not necessarily reflect the views of the National Science Foundation.'
    },
    webgl: platform.mobileSafari,
    supportsSound: true
  };

  SimLauncher.launch( () => {

    // Panels on the right side of the lattice (in the first three screens) have matching widths, within each screen and
    // across screens.
    const alignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );

    const screens = [
      new WavesScreen( alignGroup ),
      new InterferenceScreen( alignGroup ),
      new SlitsScreen( alignGroup ),
      new DiffractionScreen()
    ];
    const sim = new Sim( waveInterferenceTitleString, screens, simOptions );
    sim.start();
  } );
} );
