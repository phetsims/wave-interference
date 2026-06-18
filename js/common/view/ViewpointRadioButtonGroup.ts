// Copyright 2018-2026, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import { Viewpoint } from '../model/Viewpoint.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveInterferenceVerticalAquaRadioButtonGroup from './WaveInterferenceVerticalAquaRadioButtonGroup.js';

const sideViewString = WaveInterferenceStrings.sideView;
const topViewString = WaveInterferenceStrings.topView;

// constants
const TEXT_OPTIONS = { maxWidth: WaveInterferenceConstants.MAX_WIDTH_VIEWPORT_BUTTON_TEXT }; // Prevent from overlapping the play/pause button

class ViewpointRadioButtonGroup extends WaveInterferenceVerticalAquaRadioButtonGroup<Viewpoint> {

  public constructor( viewpointProperty: Property<Viewpoint>, options: VerticalAquaRadioButtonGroupOptions ) {

    super( viewpointProperty, [ {
      createNode: () => new WaveInterferenceText( topViewString, TEXT_OPTIONS ),

      value: 'top'
    }, {
      createNode: () => new WaveInterferenceText( sideViewString, TEXT_OPTIONS ),

      value: 'side'
    } ], options );
  }
}

export default ViewpointRadioButtonGroup;
