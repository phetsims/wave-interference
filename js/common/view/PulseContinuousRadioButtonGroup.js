// Copyright 2018, University of Colorado Boulder

//REVIEW^ since this is related to WaveTemporalType, rename to WaveTemporalTypeRadioButtonGroup ?
//REVIEW: Note to self, WaveTemporalType became DisturbanceType
/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const DisturbanceType = require( 'WAVE_INTERFERENCE/common/model/DisturbanceType' );

  class PulseContinuousRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {Property.<DisturbanceType>} disturbanceTypeProperty
     * @param {Object} [options]
     */
    constructor( disturbanceTypeProperty, options ) {
      super( disturbanceTypeProperty, [ {
        value: DisturbanceType.CONTINUOUS,
        node: new InputTypeIconNode( DisturbanceType.CONTINUOUS )
      }, {
        value: DisturbanceType.PULSE,
        node: new InputTypeIconNode( DisturbanceType.PULSE )
      } ], _.extend( {
        orientation: 'vertical',
        buttonContentXMargin: 0,
        buttonContentYMargin: 8,
        selectedLineWidth: 2,
        baseColor: 'white',
        disabledBaseColor: 'white',
        selectedStroke: 'blue',
        deselectedContentOpacity: 0.4
      }, options ) );
    }
  }

  return waveInterference.register( 'PulseContinuousRadioButtonGroup', PulseContinuousRadioButtonGroup );
} );