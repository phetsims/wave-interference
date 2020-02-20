// Copyright 2019-2020, University of Colorado Boulder

/**
 * A Checkbox customized for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const merge = require( 'PHET_CORE/merge' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceCheckbox extends Checkbox {

    /**
     * @param {Node} content
     * @param {Property.<boolean>} property
     * @param {Object} [options]
     */
    constructor( content, property, options ) {
      options = merge( { boxWidth: 14, supportsSound: options && options.audioEnabled }, options );
      super( content, property, options );
    }
  }

  return waveInterference.register( 'WaveInterferenceCheckbox', WaveInterferenceCheckbox );
} );