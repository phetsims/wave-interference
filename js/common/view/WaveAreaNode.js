// Copyright 2018, University of Colorado Boulder

/**
 * This node is used for layout only.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function WaveAreaNode( model, options ) {
    Rectangle.call( this, 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, _.extend( {

      // This node is used for layout, so don't include a stroke which could throw off the dimensions
      fill: 'blue'
    }, options ) );
  }

  waveInterference.register( 'WaveAreaNode', WaveAreaNode );

  return inherit( Rectangle, WaveAreaNode );
} );