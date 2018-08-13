// Copyright 2018, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  // strings
  const sideViewString = require( 'string!WAVE_INTERFERENCE/sideView' );
  const topViewString = require( 'string!WAVE_INTERFERENCE/topView' );

  class ViewRadioButtonGroup extends WaveInterferenceVerticalAquaRadioButtonGroup {

    /**
     * @param {Property.<ViewType>} viewTypeProperty
     * @param {Object} [options]
     */
    constructor( viewTypeProperty, options ) {
      super( [ {
        node: new WaveInterferenceText( topViewString ),
        value: ViewType.TOP,
        property: viewTypeProperty
      }, {
        node: new WaveInterferenceText( sideViewString ),
        value: ViewType.SIDE,
        property: viewTypeProperty
      } ], options );
    }
  }

  return waveInterference.register( 'ViewRadioButtonGroup', ViewRadioButtonGroup );
} );