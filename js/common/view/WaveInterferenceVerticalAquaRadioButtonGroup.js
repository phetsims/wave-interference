// Copyright 2018, University of Colorado Boulder

/**
 * Factors out commonality between VerticalAquaRadioButtonGroups used in this sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferenceVerticalAquaRadioButtonGroup( items, options ) {
    options = _.extend( { spacing: 8 }, options );
    VerticalAquaRadioButtonGroup.call( this, items, options );
  }

  waveInterference.register( 'WaveInterferenceVerticalAquaRadioButtonGroup', WaveInterferenceVerticalAquaRadioButtonGroup );

  return inherit( VerticalAquaRadioButtonGroup, WaveInterferenceVerticalAquaRadioButtonGroup );
} );