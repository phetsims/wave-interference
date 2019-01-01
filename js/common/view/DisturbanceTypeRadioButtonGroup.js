// Copyright 2018, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DisturbanceTypeEnum = require( 'WAVE_INTERFERENCE/common/model/DisturbanceTypeEnum' );
  const DisturbanceTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/DisturbanceTypeIconNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DisturbanceTypeRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {Property.<DisturbanceTypeEnum>} disturbanceTypeProperty
     * @param {Object} [options]
     */
    constructor( disturbanceTypeProperty, options ) {
      super( disturbanceTypeProperty, [ {
        value: DisturbanceTypeEnum.CONTINUOUS,
        node: new DisturbanceTypeIconNode( DisturbanceTypeEnum.CONTINUOUS )
      }, {
        value: DisturbanceTypeEnum.PULSE,
        node: new DisturbanceTypeIconNode( DisturbanceTypeEnum.PULSE )
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