// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/common/model/WavesScreenModel' );
  var BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );

  /**
   * @constructor
   */
  function SlitsScreenModel() {
    WavesScreenModel.call( this );
    this.barrierTypeProperty = new Property( BarrierTypeEnum.NO_BARRIER );

    this.lattice.setPotentialFunction( function( i, j ) {
      return i === 60 && ( ( Math.abs( 40 - j ) > 3 ) && ( Math.abs( 60 - j ) > 3 ) );
    } );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel );
} );