// Copyright 2018, University of Colorado Boulder

/**
 * This node is used for layout only.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

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