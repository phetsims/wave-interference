// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  class InterferenceScreenModel extends WavesScreenModel {
    constructor() {
      super( {
        numberOfSources: 2
      } );
    }
  }

  return waveInterference.register( 'InterferenceScreenModel', InterferenceScreenModel );
} );