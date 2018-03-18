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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/common/model/WavesScreenModel' );

  /**
   * @constructor
   */
  function InterferenceScreenModel() {
    WavesScreenModel.call( this );

    // @public {NumberProperty} the separation of the wave sources.
    this.sourceSeparationProperty = new NumberProperty( 15 );
  }

  waveInterference.register( 'InterferenceScreenModel', InterferenceScreenModel );

  return inherit( WavesScreenModel, InterferenceScreenModel );
} );