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
   * @param {Node} content
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( content, property, options ) {
    options = merge( { boxWidth: 14 }, options );
    super( content, property, options );
  }
}

waveInterference.register( 'WaveInterferenceCheckbox', WaveInterferenceCheckbox );
export default WaveInterferenceCheckbox;