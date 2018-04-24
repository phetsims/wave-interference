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
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

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

    // TODO: should the potential function be a 2D array?  Could be faster lookup.
    this.lattice.setPotentialFunction( function( i, j ) {
      var barrierLocation = self.barrierLocationProperty.get();
      var slitWidth = self.slitWidthProperty.get();
      var slitSeparation = self.slitSeparationProperty.get();
      var latticeCenterY = self.lattice.height / 2;
      if ( self.barrierTypeProperty.value === BarrierTypeEnum.NO_BARRIER ) {
        return false;
      }
      else if ( self.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
        return i === barrierLocation && ( ( j > latticeCenterY + slitWidth ) || ( j < latticeCenterY - slitWidth ) );
      }
      else if ( self.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

        // Spacing is between center of slits
        return i === barrierLocation && ( ( Math.abs( latticeCenterY - slitSeparation / 2 - j ) > slitWidth ) && ( Math.abs( latticeCenterY + slitSeparation / 2 - j ) > slitWidth ) );
      }
    } );

    this.barrierLocationProperty.link( function() {

      // When the barrier moves, it creates a lot of artifacts, so clear the wave when the barrier moves
      self.clear();
    } );

    this.stepEmitter.addListener( function() {

      var showPlaneWave = true;

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts
      if ( showPlaneWave ) {
        for ( var i = 0; i < self.barrierLocationProperty.get(); i++ ) {
          for ( var j = 0; j < self.lattice.height; j++ ) {

            // TODO: compute the correct wave speed
            var k = Util.linear( WaveInterferenceConstants.MINIMUM_FREQUENCY, WaveInterferenceConstants.MAXIMUM_FREQUENCY, 0.1, 1, self.latticeFrequencyProperty.get() );

            // Scale down the amplitude because it is calibrated for a point source, not a plane wave
            var value = self.amplitudeProperty.get() / 10 * 1.4 * Math.sin( k * i - self.latticeFrequencyProperty.value * self.time );
            var lastValue = self.lattice.getCurrentValue( i, j );
            self.lattice.setCurrentValue( i, j, value );
            self.lattice.setLastValue( i, j, lastValue );
          }
        }
      }
    } );
  }

  waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );

  return inherit( WavesScreenModel, SlitsScreenModel );
} );