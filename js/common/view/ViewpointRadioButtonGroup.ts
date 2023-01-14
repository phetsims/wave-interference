// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveInterferenceVerticalAquaRadioButtonGroup from './WaveInterferenceVerticalAquaRadioButtonGroup.js';

const sideViewString = WaveInterferenceStrings.sideView;
const topViewString = WaveInterferenceStrings.topView;

// constants
const TEXT_OPTIONS = { maxWidth: WaveInterferenceConstants.MAX_WIDTH_VIEWPORT_BUTTON_TEXT }; // Prevent from overlapping the play/pause button

class ViewpointRadioButtonGroup extends WaveInterferenceVerticalAquaRadioButtonGroup {

  public constructor( viewpointProperty, options ) {

    super( viewpointProperty, [ {
      createNode: () => new WaveInterferenceText( topViewString, TEXT_OPTIONS ),
      value: WavesModel.Viewpoint.TOP
    }, {
      createNode: () => new WaveInterferenceText( sideViewString, TEXT_OPTIONS ),
      value: WavesModel.Viewpoint.SIDE
    } ], options );
  }
}

waveInterference.register( 'ViewpointRadioButtonGroup', ViewpointRadioButtonGroup );
export default ViewpointRadioButtonGroup;