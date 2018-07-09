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
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
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

    // @public {Vector2} - horizontal location of the barrier in lattice coordinates (includes damping region)
    //                   - note: this is a floating point 2D representation so it can work seamlessly with DragListener
    //                   - see getBarrierLocation() for how to get the integral x-coordinate.
    this.barrierLocationProperty = new Property( new Vector2( 38, 0 ) );

    // @public {NumberProperty} - width of the slit(s) opening in lattice coordinates.
    this.slitWidthProperty = new NumberProperty( 5 );

    // @public {NumberProperty} - separation of centers of the slits in lattice coordinates
    // TODO: Move this to each scene and get the units right
    this.slitSeparationProperty = new NumberProperty( 20 );

    this.barrierLocationProperty.link( function() {

      // When the barrier moves, it creates a lot of artifacts, so clear the wave when the barrier moves
      self.clear();
    } );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel, {

    /**
     * Returns the horizontal barrier location in integer coordinates.
     * @public
     */
    getBarrierLocation: function() {
      return Math.round( this.barrierLocationProperty.get().x );
    },

    /**
     * Set the incoming source values, in this case it is a plane wave on the left side of the lattice.
     * @param {Lattice} lattice
     * @override
     * @protected
     */
    setSourceValues: function( lattice ) {

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts
      for ( var i = 0; i < this.getBarrierLocation() + 1; i++ ) {
        for ( var j = 0; j < lattice.height; j++ ) {

          if ( this.button1PressedProperty.get() ) {

            // TODO: map lattice coordinates to model coordinate frame, then do sin(kx-wt) there, perhaps use wave speed in model coordinates.
            // TODO: Plane wave is wrong speed/wavelength
            var frequency = this.sceneProperty.get().frequencyProperty.get();
            var latticeFrequency = frequency * this.sceneProperty.get().timeScaleFactor;
            var k = Util.linear( 1, 19, 0.1, 1, latticeFrequency );

            // Scale the amplitude because it is calibrated for a point source, not a plane wave
            var value = this.amplitudeProperty.get() * 0.21 * Math.sin( k * i - frequency * this.time );
            var lastValue = lattice.getCurrentValue( i, j );
            lattice.setCurrentValue( i, j, value );
            lattice.setLastValue( i, j, lastValue );
          }
          else {

            // Instantly clear the incoming wave, otherwise there are too many odd reflections
            lattice.setCurrentValue( i, j, 0 );
          }
        }
      }

      if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT || this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {
        var barrierX = Math.round( this.barrierLocationProperty.get().x );
        var slitWidth = this.slitWidthProperty.get();
        var slitSeparation = this.slitSeparationProperty.get();
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
            var top = Math.abs( latticeCenterY - slitSeparation / 2 - j ) > slitWidth;
            var bottom = Math.abs( latticeCenterY + slitSeparation / 2 - j ) > slitWidth;
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