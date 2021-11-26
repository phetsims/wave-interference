// Copyright 2018-2020, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
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
      maxWidth: WaveInterferenceConstants.MAX_WIDTH
    }, options ) );
  }
}

waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
export default WaveInterferenceText;