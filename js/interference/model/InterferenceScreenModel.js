// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Interference screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  /**
   * @constructor
   */
  function InterferenceScreenModel() {
    WavesScreenModel.call( this, {

      // Indicates two sources instead of one, with this separation in lattice coordinates
      sourceSeparation: 16
    } );
  }

  waveInterference.register( 'InterferenceScreenModel', InterferenceScreenModel );

  return inherit( WavesScreenModel, InterferenceScreenModel );
} );