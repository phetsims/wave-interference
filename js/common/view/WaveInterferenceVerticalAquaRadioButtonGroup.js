// Copyright 2018-2019, University of Colorado Boulder

/**
 * Factors out commonality between VerticalAquaRadioButtonGroups used in this sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceVerticalAquaRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {Property} property
     * @param {Object[]} items - see VerticalAquaRadioButtonGroup
     * @param {Object} [options]
     */
    constructor( property, items, options ) {
      options = _.extend( { spacing: 8 }, options );
      super( property, items, options );
    }
  }

  return waveInterference.register( 'WaveInterferenceVerticalAquaRadioButtonGroup', WaveInterferenceVerticalAquaRadioButtonGroup );
} );