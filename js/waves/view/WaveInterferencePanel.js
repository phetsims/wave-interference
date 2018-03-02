// Copyright 2018, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaveInterferencePanel( content, options ) {
    options = _.extend( {
      yMargin: 10,
      xMargin: 10,
      fill: 'rgb(226,227,229)'
    }, options );
    Panel.call( this, content, options );
  }

  waveInterference.register( 'WaveInterferencePanel', WaveInterferencePanel );

  return inherit( Panel, WaveInterferencePanel );
} );