// Copyright 2017-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import platform from '../../phet-core/js/platform.js';
import AlignGroup from '../../scenery/js/nodes/AlignGroup.js';
import DiffractionScreen from './diffraction/DiffractionScreen.js';
import InterferenceScreen from './interference/InterferenceScreen.js';
import SlitsScreen from './slits/SlitsScreen.js';
import waveInterferenceStrings from './waveInterferenceStrings.js';
import WavesScreen from './waves/WavesScreen.js';

const waveInterferenceTitleString = waveInterferenceStrings[ 'wave-interference' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Amy Rouinfar, Noah Podolefsky',
    softwareDevelopment: 'Sam Reid',
    team: 'Wendy Adams, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Katie Woessner',
    qualityAssurance: 'Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Katie Woessner, Kelly Wurtz',
    graphicArts: 'Cheryl McCutchan',
    thanks: 'This material is based upon work supported by the National Science Foundation under STROBE Grant No. DMR ' +
            '1548924. Any opinions, findings, and conclusions or recommendations expressed in this material are those ' +
            'of the author(s) and do not necessarily reflect the views of the National Science Foundation.'
  },
  webgl: platform.mobileSafari
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