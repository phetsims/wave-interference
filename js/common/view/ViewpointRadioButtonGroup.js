// Copyright 2018-2019, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceVerticalAquaRadioButtonGroup' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );

  // strings
  const sideViewString = require( 'string!WAVE_INTERFERENCE/sideView' );
  const topViewString = require( 'string!WAVE_INTERFERENCE/topView' );

  // constants
  const TEXT_OPTIONS = { maxWidth: 90 }; // Prevent from overlapping the play/pause button

  class ViewpointRadioButtonGroup extends WaveInterferenceVerticalAquaRadioButtonGroup {

    /**
     * @param {Property.<Viewpoint>} viewpointProperty
     * @param {Object} [options]
     */
    constructor( viewpointProperty, options ) {

      super( viewpointProperty, [ {
        node: new WaveInterferenceText( topViewString, TEXT_OPTIONS ),
        value: WavesModel.Viewpoint.TOP
      }, {
        node: new WaveInterferenceText( sideViewString, TEXT_OPTIONS ),
        value: WavesModel.Viewpoint.SIDE
      } ], options );
    }
  }

  return waveInterference.register( 'ViewpointRadioButtonGroup', ViewpointRadioButtonGroup );
} );