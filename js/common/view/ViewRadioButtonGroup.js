// Copyright 2018, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/common/model/ViewTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  /**
   * @param {Property.<ViewTypeEnum>} viewTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ViewRadioButtonGroup( viewTypeProperty, options ) {
    WaveInterferenceVerticalAquaRadioButtonGroup.call( this, [ {
      node: new WaveInterferenceText( 'Top View' ),
      value: ViewTypeEnum.TOP,
      property: viewTypeProperty
    }, {
      node: new WaveInterferenceText( 'Side View' ),
      value: ViewTypeEnum.SIDE,
      property: viewTypeProperty
    } ], options );
  }

  waveInterference.register( 'ViewRadioButtonGroup', ViewRadioButtonGroup );

  return inherit( WaveInterferenceVerticalAquaRadioButtonGroup, ViewRadioButtonGroup );
} );