// Copyright 2018, University of Colorado Boulder

/**
 * Panel subclass that applies styling specific to the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Panel = require( 'SUN/Panel' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferencePanel extends Panel {

    /**
     * @param {Node} content
     * @param {Object} [options]
     * @constructor // TODO: remove extraneous constructor annotations, see https://github.com/phetsims/chipper/issues/691#issuecomment-405025033
     */
    constructor( content, options ) {
      options = _.extend( {
        yMargin: 6,
        xMargin: 10,
        stroke: 'gray',
        fill: 'rgb(230,231,232)'
      }, options );
      super( content, options );
    }
  }

  return waveInterference.register( 'WaveInterferencePanel', WaveInterferencePanel );
} );