// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
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

class DisturbanceTypeRadioButtonGroup extends RectangularRadioButtonGroup {

  public constructor( disturbanceTypeProperty, options ) {
    super( disturbanceTypeProperty, [ {
      value: Scene.DisturbanceType.CONTINUOUS,
      createNode: () => new DisturbanceTypeIconNode( Scene.DisturbanceType.CONTINUOUS )
    }, {
      value: Scene.DisturbanceType.PULSE,
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