// Copyright 2018, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DisturbanceTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/DisturbanceTypeIconNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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
      } ], _.extend( {
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

  return waveInterference.register( 'DisturbanceTypeRadioButtonGroup', DisturbanceTypeRadioButtonGroup );
} );