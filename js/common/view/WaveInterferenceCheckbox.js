// Copyright 2019-2020, University of Colorado Boulder

/**
 * A Checkbox customized for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import waveInterference from '../../waveInterference.js';

class WaveInterferenceCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} property
   * @param {Node} content
   * @param {Object} [options]
   */
  constructor( property, content, options ) {
    options = merge( { boxWidth: 14 }, options );
    super( property, content, options );
  }
}

waveInterference.register( 'WaveInterferenceCheckbox', WaveInterferenceCheckbox );
export default WaveInterferenceCheckbox;