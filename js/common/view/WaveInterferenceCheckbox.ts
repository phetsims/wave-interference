// Copyright 2019-2022, University of Colorado Boulder

/**
 * A Checkbox customized for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { Node } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';

class WaveInterferenceCheckbox extends Checkbox {

  public constructor( property: Property<boolean>, content: Node, options?: CheckboxOptions ) {
    options = merge( { boxWidth: 14 }, options );
    super( property, content, options );
  }
}

waveInterference.register( 'WaveInterferenceCheckbox', WaveInterferenceCheckbox );
export default WaveInterferenceCheckbox;