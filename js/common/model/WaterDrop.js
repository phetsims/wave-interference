// Copyright 2018, University of Colorado Boulder

/**
 * The model for a water drop which falls to the water in the water scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @constructor
   */
  function WaterDrop() {

    this.heightProperty = new NumberProperty();
  }

  waveInterference.register( 'WaterDrop', WaterDrop );

  return inherit( Object, WaterDrop );
} );