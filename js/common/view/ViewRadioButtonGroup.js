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

  // strings
  var topViewString = require( 'string!WAVE_INTERFERENCE/topView' );
  var sideViewString = require( 'string!WAVE_INTERFERENCE/sideView' );

  /**
   * @param {Property.<ViewTypeEnum>} viewTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ViewRadioButtonGroup( viewTypeProperty, options ) {
    WaveInterferenceVerticalAquaRadioButtonGroup.call( this, [ {
      node: new WaveInterferenceText( topViewString ),
      value: ViewTypeEnum.TOP,
      property: viewTypeProperty
    }, {
      node: new WaveInterferenceText( sideViewString ),
      value: ViewTypeEnum.SIDE,
      property: viewTypeProperty
    } ], options );
  }

  waveInterference.register( 'ViewRadioButtonGroup', ViewRadioButtonGroup );

  return inherit( WaveInterferenceVerticalAquaRadioButtonGroup, ViewRadioButtonGroup );
} );