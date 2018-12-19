// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  class InterferenceScreenModel extends WavesScreenModel {
    constructor() {
      super( {
        numberOfSources: 2,

        //REVIEW There's an extended comment about the default value for initialAmplitude over in WaveScreenModel, and
        //REVIEW: it's not 10. Why did you choose this value here?
        //REVIEW*: By design, the Interference screen is supposed to start at the max amplitude value.  I've refactored
        //REVIEW* to indicate that.
        initialAmplitude: WaveInterferenceConstants.AMPLITUDE_RANGE.max
      } );
    }
  }

  return waveInterference.register( 'InterferenceScreenModel', InterferenceScreenModel );
} );