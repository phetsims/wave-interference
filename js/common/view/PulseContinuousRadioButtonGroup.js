// Copyright 2018, University of Colorado Boulder

/**
 * Shows the "pulse" vs "continuous" radio buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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