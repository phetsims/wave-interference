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
    var barrierMoved = function() {
      self.clear(); // TODO: restart propagation from the left
    };
    this.waterScene.barrierLocationProperty.link( barrierMoved );
    this.soundScene.barrierLocationProperty.link( barrierMoved );
    this.lightScene.barrierLocationProperty.link( barrierMoved );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel, {

    /**
     * Set the incoming source values, in this case it is a plane wave on the left side of the lattice.
     * @override
     * @protected
     */
    setSourceValues: function() {
      var lattice = this.lattice;

      var scene = this.sceneProperty.get();
      var barrierLatticeX = scene.modelToLatticeTransform.modelToViewX( scene.getBarrierLocation() );
      var slitSeparationModel = scene.slitSeparationProperty.get();

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts

      for ( var i = 0; i <= barrierLatticeX; i++ ) {

        // Find the physical model coordinate corresponding to the lattice coordinate
        var x = scene.modelToLatticeTransform.viewToModelX( i );

        var frequency = scene.frequencyProperty.get();
        var wavelength = scene.waveSpeed / frequency * Math.PI * 2; // TODO: is this correct for sound and light?

        for ( var j = 0; j < lattice.height; j++ ) {
          var y = scene.modelToLatticeTransform.viewToModelY( j );

          // Zero out values in the barrier
          var isCellInBarrier = false;

          if ( i === barrierLatticeX ) {

            var slitWidthModel = scene.slitWidthProperty.get();
            var slitWidth = scene.modelToLatticeTransform.modelToViewDeltaY( slitWidthModel );
            var latticeCenterY = this.lattice.height / 2;

            // TODO: NO_SLIT should just propagate the plane wave the entire area, this will avoid artifacts everywhere

            if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
              var low = j > latticeCenterY + slitWidth / 2;
              var high = j < latticeCenterY - slitWidth / 2;
              isCellInBarrier = low || high;
            }
            else if ( this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

              // Spacing is between center of slits.  This computation is done in model coordinates
              var topBarrierWidth = ( scene.waveAreaWidth - slitWidthModel - slitSeparationModel ) / 2;
              var centralBarrierWidth = scene.waveAreaWidth - 2 * topBarrierWidth - 2 * slitWidthModel;
              var inTop = y <= topBarrierWidth;
              var inBottom = y >= scene.waveAreaWidth - topBarrierWidth;
              var inCenter = ( y >= topBarrierWidth + slitWidthModel ) && ( y <= topBarrierWidth + slitWidthModel + centralBarrierWidth );
              isCellInBarrier = inTop || inBottom || inCenter;
            }
          }

          if ( this.button1PressedProperty.get() && !isCellInBarrier ) {

            // lambda * k = 2 * pi
            // k = 2pi/lambda
            var k = Math.PI * 2 / wavelength;

            // TODO: use wave speed to track the wavefront and back, there is an issue for this

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
    }
  } );
} );