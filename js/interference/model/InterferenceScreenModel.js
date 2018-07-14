// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  /**
   * @constructor
   */
  function InterferenceScreenModel() {
    WavesScreenModel.call( this, {
      numberOfSources: 2
    } );
  }

  waveInterference.register( 'InterferenceScreenModel', InterferenceScreenModel );

  return inherit( WavesScreenModel, InterferenceScreenModel );
} );