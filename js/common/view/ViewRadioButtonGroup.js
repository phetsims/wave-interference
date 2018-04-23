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
  var ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  // strings
  var topViewString = require( 'string!WAVE_INTERFERENCE/topView' );
  var sideViewString = require( 'string!WAVE_INTERFERENCE/sideView' );

  /**
   * @param {Property.<ViewType>} viewTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ViewRadioButtonGroup( viewTypeProperty, options ) {
    WaveInterferenceVerticalAquaRadioButtonGroup.call( this, [ {
      node: new WaveInterferenceText( topViewString ),
      value: ViewType.TOP,
      property: viewTypeProperty
    }, {
      node: new WaveInterferenceText( sideViewString ),
      value: ViewType.SIDE,
      property: viewTypeProperty
    } ], options );
  }

  waveInterference.register( 'ViewRadioButtonGroup', ViewRadioButtonGroup );

  return inherit( WaveInterferenceVerticalAquaRadioButtonGroup, ViewRadioButtonGroup );
} );