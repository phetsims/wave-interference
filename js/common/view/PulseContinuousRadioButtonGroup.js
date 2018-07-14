// Copyright 2018, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Property.<IncomingWaveType>} inputTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function PulseContinuousRadioButtonGroup( inputTypeProperty, options ) {
    RadioButtonGroup.call( this, inputTypeProperty, [ {
      value: IncomingWaveType.PULSE,
      node: new InputTypeIconNode( IncomingWaveType.PULSE )
    }, {
      value: IncomingWaveType.CONTINUOUS,
      node: new InputTypeIconNode( IncomingWaveType.CONTINUOUS )
    } ], _.extend( {
      orientation: 'horizontal',
      buttonContentXMargin: 0,
      buttonContentYMargin: 8,
      selectedLineWidth: 2,
      baseColor: 'white',
      disabledBaseColor: 'white',
      selectedStroke: 'blue',
      deselectedContentOpacity: 0.4
    }, options ) );
  }

  waveInterference.register( 'PulseContinuousRadioButtonGroup', PulseContinuousRadioButtonGroup );

  return inherit( RadioButtonGroup, PulseContinuousRadioButtonGroup );
} );