// Copyright 2018-2020, University of Colorado Boulder

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

  /**
   * @param {Property.<Scene.DisturbanceType>} disturbanceTypeProperty
   * @param {Object} [options]
   */
  constructor( disturbanceTypeProperty, options ) {
    super( disturbanceTypeProperty, [ {
      value: Scene.DisturbanceType.CONTINUOUS,
      node: new DisturbanceTypeIconNode( Scene.DisturbanceType.CONTINUOUS )
    }, {
      value: Scene.DisturbanceType.PULSE,
      node: new DisturbanceTypeIconNode( Scene.DisturbanceType.PULSE )
    } ], merge( {
      orientation: 'vertical',
      radioButtonOptions: {
        xMargin: 1,
        yMargin: 8,
        selectedLineWidth: 2,
        baseColor: 'white',
        selectedStroke: 'blue',
        deselectedContentOpacity: 0.4
      }
    }, options ) );
  }
}

waveInterference.register( 'DisturbanceTypeRadioButtonGroup', DisturbanceTypeRadioButtonGroup );
export default DisturbanceTypeRadioButtonGroup;