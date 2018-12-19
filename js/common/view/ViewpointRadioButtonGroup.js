// Copyright 2018, University of Colorado Boulder

//REVIEW since this is related to ViewType, rename to ViewTypeRadioButtonGroup ?
//REVIEW*: Renamed to ViewpointRadioButtonGroup to match ViewpointEnum
/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ViewpointEnum = require( 'WAVE_INTERFERENCE/common/model/ViewpointEnum' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  // strings
  const sideViewString = require( 'string!WAVE_INTERFERENCE/sideView' );
  const topViewString = require( 'string!WAVE_INTERFERENCE/topView' );

  // constants
  const TEXT_OPTIONS = { maxWidth: 90 }; // Prevent from overlapping the play/pause button

  class ViewpointRadioButtonGroup extends WaveInterferenceVerticalAquaRadioButtonGroup {

    /**
     * @param {Property.<ViewpointEnum>} viewpointProperty
     * @param {Object} [options]
     */
    constructor( viewpointProperty, options ) {

      super( [ {
        node: new WaveInterferenceText( topViewString, TEXT_OPTIONS ),
        value: ViewpointEnum.TOP,
        property: viewpointProperty
      }, {
        node: new WaveInterferenceText( sideViewString, TEXT_OPTIONS ),
        value: ViewpointEnum.SIDE,
        property: viewpointProperty
      } ], options );
    }
  }

  return waveInterference.register( 'ViewpointRadioButtonGroup', ViewpointRadioButtonGroup );
} );