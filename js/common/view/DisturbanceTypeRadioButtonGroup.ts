// Copyright 2018-2024, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import Scene from '../model/Scene.js';
import DisturbanceTypeIconNode from './DisturbanceTypeIconNode.js';

// @ts-expect-error
class DisturbanceTypeRadioButtonGroup extends RectangularRadioButtonGroup {

  // @ts-expect-error
  public constructor( disturbanceTypeProperty, options ) {

    super( disturbanceTypeProperty, [ {
      // @ts-expect-error
      value: Scene.DisturbanceType.CONTINUOUS,

      // @ts-expect-error
      createNode: () => new DisturbanceTypeIconNode( Scene.DisturbanceType.CONTINUOUS )
    }, {

      // @ts-expect-error
      value: Scene.DisturbanceType.PULSE,

      // @ts-expect-error
      createNode: () => new DisturbanceTypeIconNode( Scene.DisturbanceType.PULSE )
    } ], merge( {
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

waveInterference.register( 'DisturbanceTypeRadioButtonGroup', DisturbanceTypeRadioButtonGroup );
export default DisturbanceTypeRadioButtonGroup;