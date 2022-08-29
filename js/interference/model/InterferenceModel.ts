// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../../waves/model/WavesModel.js';

class InterferenceModel extends WavesModel {
  public constructor() {
    super( {
      numberOfSources: 2,
      initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max
    } );
  }
}

waveInterference.register( 'InterferenceModel', InterferenceModel );
export default InterferenceModel;