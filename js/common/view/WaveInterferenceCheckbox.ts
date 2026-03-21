// Copyright 2019-2026, University of Colorado Boulder

/**
 * A Checkbox customized for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';

class WaveInterferenceCheckbox extends Checkbox {

  public constructor( property: Property<boolean>, content: Node, options?: CheckboxOptions ) {
    options = merge( { boxWidth: 14 }, options );
    super( property, content, options );
  }
}

export default WaveInterferenceCheckbox;
