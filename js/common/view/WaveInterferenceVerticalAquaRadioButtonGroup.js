// Copyright 2018, University of Colorado Boulder

/**
 * Factors out commonality between VerticalAquaRadioButtonGroups used in this sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

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