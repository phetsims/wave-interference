// Copyright 2018-2026, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WavesModel from '../../waves/model/WavesModel.js';

class InterferenceModel extends WavesModel {
  public constructor() {
    super( {

      // @ts-expect-error - runtime-only options consumed by WavesModel via merge(), not part of WavesModelOptions
      numberOfSources: 2,
      initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max
    } );
  }
}

export default InterferenceModel;
