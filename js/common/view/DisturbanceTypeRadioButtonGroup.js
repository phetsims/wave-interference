// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import waveInterference from '../../waveInterference.js';
import Scene from '../model/Scene.js';
import DisturbanceTypeIconNode from './DisturbanceTypeIconNode.js';

class DisturbanceTypeRadioButtonGroup extends RadioButtonGroup {

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
      buttonContentXMargin: 1,
      buttonContentYMargin: 8,
      selectedLineWidth: 2,
      baseColor: 'white',
      disabledBaseColor: 'white',
      selectedStroke: 'blue',
      deselectedContentOpacity: 0.4
    }, options ) );
  }
}

waveInterference.register( 'DisturbanceTypeRadioButtonGroup', DisturbanceTypeRadioButtonGroup );
export default DisturbanceTypeRadioButtonGroup;