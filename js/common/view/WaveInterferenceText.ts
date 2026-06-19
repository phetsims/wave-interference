// Copyright 2018-2026, University of Colorado Boulder

/**
 * Factors out common way of rendering text within the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class WaveInterferenceText extends Text {
  public constructor( string: string | number | TReadOnlyProperty<string>, options?: TextOptions ) {
    super( string, merge( {
      font: WaveInterferenceConstants.DEFAULT_FONT,
      maxWidth: WaveInterferenceConstants.MAX_WIDTH
    }, options ) );
  }
}

export default WaveInterferenceText;
