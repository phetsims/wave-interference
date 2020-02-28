// Copyright 2018-2020, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class WaveInterferenceText extends Text {

  /**
   * @param {string} string
   * @param {Object} [options]
   */
  constructor( string, options ) {
    super( string, merge( {
      font: WaveInterferenceConstants.DEFAULT_FONT,

      // This addresses numerous cases where `maxWidth: 120` would have to otherwise be set in client code.
      maxWidth: 120
    }, options ) );
  }
}

waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
export default WaveInterferenceText;