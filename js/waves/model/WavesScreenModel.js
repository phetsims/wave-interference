// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/ViewTypeEnum' );

  /**
   * @constructor
   */
  function WavesScreenModel() {
    this.viewTypeProperty = new Property( ViewTypeEnum.TOP, {
      validValues: ViewTypeEnum.VALUES
    } );
  }

  waveInterference.register( 'WavesScreenModel', WavesScreenModel );

  return inherit( Object, WavesScreenModel );
} );