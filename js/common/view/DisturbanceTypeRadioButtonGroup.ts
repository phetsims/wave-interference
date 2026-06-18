// Copyright 2018-2026, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { DisturbanceType } from '../model/DisturbanceType.js';
import DisturbanceTypeIconNode from './DisturbanceTypeIconNode.js';

class DisturbanceTypeRadioButtonGroup extends RectangularRadioButtonGroup<DisturbanceType> {

  public constructor( disturbanceTypeProperty: Property<DisturbanceType>, options?: RectangularRadioButtonGroupOptions ) {

    const items: RectangularRadioButtonGroupItem<DisturbanceType>[] = [ {
      value: 'continuous',
      createNode: () => new DisturbanceTypeIconNode( 'continuous' )
    }, {
      value: 'pulse',
      createNode: () => new DisturbanceTypeIconNode( 'pulse' )
    } ];

    super( disturbanceTypeProperty, items, merge( {
      orientation: 'vertical',
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 1,
        yMargin: 8,
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 2,
          selectedStroke: 'blue',
          deselectedContentOpacity: 0.4
        }
      }
    }, options ) );
  }
}

export default DisturbanceTypeRadioButtonGroup;
