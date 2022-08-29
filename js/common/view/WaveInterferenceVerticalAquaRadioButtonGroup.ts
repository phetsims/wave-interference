// Copyright 2018-2022, University of Colorado Boulder

/**
 * Factors out commonality between VerticalAquaRadioButtonGroups used in this sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';

class WaveInterferenceVerticalAquaRadioButtonGroup<T> extends VerticalAquaRadioButtonGroup<T> {

  public constructor( property: Property<T>, items: AquaRadioButtonGroupItem<T>[], options?: VerticalAquaRadioButtonGroupOptions ) {
    options = merge( { spacing: 8 }, options );
    super( property, items, options );
  }
}

waveInterference.register( 'WaveInterferenceVerticalAquaRadioButtonGroup', WaveInterferenceVerticalAquaRadioButtonGroup );
export default WaveInterferenceVerticalAquaRadioButtonGroup;