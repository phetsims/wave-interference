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
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  /**
   * @constructor
   */
  function SlitsScreenModel() {
    WavesScreenModel.call( this );
    var self = this;

    // @public {Property.<BarrierTypeEnum>} - type of the barrier in the lattice
    this.barrierTypeProperty = new Property( BarrierTypeEnum.ONE_SLIT );

    // When the barrier moves, it creates a lot of artifacts, so clear the wave when the barrier moves
    this.waterScene.barrierLocationProperty.link( function() { self.clear(); } );
    this.soundScene.barrierLocationProperty.link( function() { self.clear(); } );
    this.lightScene.barrierLocationProperty.link( function() { self.clear(); } );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel, {

    /**
     * Set the incoming source values, in this case it is a plane wave on the left side of the lattice.
     * @param {Lattice} lattice
     * @override
     * @protected
     */
    setSourceValues: function( lattice ) {

      var scene = this.sceneProperty.get();
      var barrierLocationInLatticeCoordinates = scene.modelToLatticeTransform.modelToViewX( scene.getBarrierLocation() );

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts

      // TODO: Plane wave is wrong speed/wavelength
      for ( var i = 0; i < barrierLocationInLatticeCoordinates + 1; i++ ) {

        // Find the physical model coordinate corresponding to the lattice coordinate
        var x = scene.modelToLatticeTransform.viewToModelX( i );

        var frequency = scene.frequencyProperty.get();
        var wavelength = scene.waveSpeed / frequency * Math.PI * 2; // TODO: is this correct for sound and light?

        for ( var j = 0; j < lattice.height; j++ ) {

          if ( this.button1PressedProperty.get() ) {

            // lambda * k = 2 * pi
            // k = 2pi/lambda
            var k = Math.PI * 2 / wavelength;

            // TODO: use wave speed to track the wavefront, there is an issue for this

            // Scale the amplitude because it is calibrated for a point source, not a plane wave
            var value = this.amplitudeProperty.get() * 0.21 * Math.sin( k * x - frequency * this.time );
            var lastValue = lattice.getCurrentValue( i, j );
            lattice.setCurrentValue( i, j, value );
            lattice.setLastValue( i, j, lastValue );
          }
          else {

            // Instantly clear the incoming wave, otherwise there are too many odd reflections
            lattice.setCurrentValue( i, j, 0 );
            lattice.setLastValue( i, j, 0 );
          }
        }
      }

      // Zero out values in the barrier
      if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT || this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {
        var barrierX = barrierLocationInLatticeCoordinates;
        var slitWidth = scene.slitWidthProperty.get();
        var slitSeparationModelCoordinates = scene.slitSeparationProperty.get();
        var slitSeparationInLatticeCoordinates = scene.modelToLatticeTransform.modelToViewDeltaY( slitSeparationModelCoordinates );
        var latticeCenterY = this.lattice.height / 2;

        for ( j = 0; j < lattice.height; j++ ) {

          var isCellInBarrier = false;

          if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
            var low = j > latticeCenterY + slitWidth;
            var high = j < latticeCenterY - slitWidth;
            isCellInBarrier = low || high;
          }
          else if ( this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

            // Spacing is between center of slits
            var top = Math.abs( latticeCenterY - slitSeparationInLatticeCoordinates / 2 - j ) > slitWidth;
            var bottom = Math.abs( latticeCenterY + slitSeparationInLatticeCoordinates / 2 - j ) > slitWidth;
            isCellInBarrier = top && bottom;
          }

          if ( isCellInBarrier ) {
            lattice.setLastValue( barrierX, j, 0 );
            lattice.setCurrentValue( barrierX, j, 0 );
          }
        }
      }
    }
  } );
} );