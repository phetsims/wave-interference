// Copyright 2018-2020, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveInterferenceVerticalAquaRadioButtonGroup from './WaveInterferenceVerticalAquaRadioButtonGroup.js';

const sideViewString = waveInterferenceStrings.sideView;
const topViewString = waveInterferenceStrings.topView;

// constants
const TEXT_OPTIONS = { maxWidth: WaveInterferenceConstants.MAX_WIDTH_VIEWPORT_BUTTON_TEXT }; // Prevent from overlapping the play/pause button

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

waveInterference.register( 'ViewpointRadioButtonGroup', ViewpointRadioButtonGroup );
export default ViewpointRadioButtonGroup;