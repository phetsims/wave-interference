// Copyright 2018, University of Colorado Boulder

/**
 * This node is used for layout only.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class WaveAreaNode extends Rectangle {

    /**
     * @param {WavesScreenModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {
      super( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, _.extend( {

        // This node is used for layout, so don't include a stroke which could throw off the dimensions
        fill: 'blue'
      }, options ) );
    }
  }

  return waveInterference.register( 'WaveAreaNode', WaveAreaNode );
} );