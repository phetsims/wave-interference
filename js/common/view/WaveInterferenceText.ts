// Copyright 2018-2022, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class WaveInterferenceText extends Text {
  public constructor( string: string | number, options?: TextOptions ) {
    super( string, merge( {
      font: WaveInterferenceConstants.DEFAULT_FONT,
      maxWidth: WaveInterferenceConstants.MAX_WIDTH
    }, options ) );
  }
}

waveInterference.register( 'WaveInterferenceText', WaveInterferenceText );
export default WaveInterferenceText;