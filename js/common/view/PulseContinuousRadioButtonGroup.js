// Copyright 2018, University of Colorado Boulder

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
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  class PulseContinuousRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {Property.<WaveTemporalType>} waveTemporalTypeProperty
     * @param {Object} [options]
     */
    constructor( waveTemporalTypeProperty, options ) {
      super( waveTemporalTypeProperty, [ {
        value: WaveTemporalType.CONTINUOUS,
        node: new InputTypeIconNode( WaveTemporalType.CONTINUOUS )
      }, {
        value: WaveTemporalType.PULSE,
        node: new InputTypeIconNode( WaveTemporalType.PULSE )
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