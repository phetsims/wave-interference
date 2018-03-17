// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/common/model/WavesScreenModel' );

  /**
   * @constructor
   */
  function SlitsScreenModel() {
    WavesScreenModel.call( this );
    var self = this;

    // @public {Property.<BarrierTypeEnum>} - type of the barrier in the lattice
    this.barrierTypeProperty = new Property( BarrierTypeEnum.NO_BARRIER );

    // @public {NumberProperty} - horizontal location of the barrier in lattice coordinates
    this.barrierLocationProperty = new NumberProperty( 60 );

    // @public {NumberProperty} - width of the slit(s) in lattice coordinates
    this.slitWidthProperty = new NumberProperty( 5 );

    // @public {NumberProperty} - separation of centers of the slits in lattice coordinates
    this.slitSeparationProperty = new NumberProperty( 20 );

    this.lattice.setPotentialFunction( function( i, j ) {
      var barrierLocation = self.barrierLocationProperty.get();
      var slitWidth = self.slitWidthProperty.get();
      var slitSeparation = self.slitSeparationProperty.get();
      var latticeCenter = self.lattice.height / 2;
      if ( self.barrierTypeProperty.value === BarrierTypeEnum.NO_BARRIER ) {
        return false;
      }
      else if ( self.barrierTypeProperty.value === BarrierTypeEnum.MIRROR ) {
        return i === barrierLocation;
      }
      else if ( self.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
        return i === barrierLocation && ( ( j > latticeCenter + slitWidth ) || ( j < latticeCenter - slitWidth ) );
      }
      else if ( self.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

        // TODO: spacing should be between center of slits?
        return i === barrierLocation && ( ( Math.abs( latticeCenter - slitSeparation - j ) > slitWidth ) && ( Math.abs( latticeCenter + slitSeparation - j ) > slitWidth ) );
      }
    } );

    this.barrierLocationProperty.link( function() {

      // When the barrier moves, it creates a lot of artifacts
      // TODO: should we keep this behavior?
      self.clear();
    } );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel );
} );