// Copyright 2018, University of Colorado Boulder

/**
 * Model for the Slits screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const Property = require( 'AXON/Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WavesScreenModel = require( 'WAVE_INTERFERENCE/waves/model/WavesScreenModel' );

  class SlitsScreenModel extends WavesScreenModel {

    constructor() {
      super( {
        initialAmplitude: 10
      } );

      // @public {Property.<BarrierTypeEnum>} - type of the barrier in the lattice
      this.barrierTypeProperty = new Property( BarrierTypeEnum.ONE_SLIT );

      // When the barrier moves, it creates a lot of artifacts, so clear the wave when the barrier moves
      // TODO: restart propagation from the left, see https://github.com/phetsims/wave-interference/issues/47
      const barrierMoved = this.clear.bind( this );
      this.waterScene.barrierLocationProperty.link( barrierMoved );
      this.soundScene.barrierLocationProperty.link( barrierMoved );
      this.lightScene.barrierLocationProperty.link( barrierMoved );

      // @protected {number} - record the time the button was pressed, so the SlitsScreenModel can propagate the right distance
      this.button1PressTime = 0;
      this.button1PressedProperty.link( ( pressed ) => {
        if ( pressed ) {
          this.button1PressTime = this.time;
        }
        else {
          this.lattice.clear();
        }
      } );
    }

    /**
     * Set the incoming source values, in this case it is a plane wave on the left side of the lattice.
     * @override
     * @protected
     */
    setSourceValues() {
      const lattice = this.lattice;

      const scene = this.sceneProperty.get();

      // Round this to make sure it appears at an integer cell column
      let barrierLatticeX = Math.round( scene.modelToLatticeTransform.modelToViewX( scene.getBarrierLocation() ) );
      const slitSeparationModel = scene.slitSeparationProperty.get();

      const frontTime = this.time - this.button1PressTime;
      let frontPosition = Math.round( scene.modelToLatticeTransform.modelToViewX( scene.waveSpeed * frontTime ) );

      // Split into 2 regions.
      // 1. The region where there could be a wave (if it matches the button press and isn't in the barrier)
      // 2. The empirical part beyond the barrier

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts, see https://github.com/phetsims/wave-interference/issues/47
      if ( this.barrierTypeProperty.value === BarrierTypeEnum.NO_BARRIER ) {
        barrierLatticeX = lattice.width - lattice.dampX;
      }
      for ( let i = lattice.dampX; i <= barrierLatticeX; i++ ) {

        // Find the physical model coordinate corresponding to the lattice coordinate
        const x = scene.modelToLatticeTransform.viewToModelX( i );

        let frequency = scene.frequencyProperty.get();
        let wavelength = scene.waveSpeed / frequency;

        for ( let j = 0; j < lattice.height; j++ ) {
          const y = scene.modelToLatticeTransform.viewToModelY( j );

          // Zero out values in the barrier
          let isCellInBarrier = false;

          if ( i === barrierLatticeX ) {

            const slitWidthModel = scene.slitWidthProperty.get();
            const slitWidth = scene.modelToLatticeTransform.modelToViewDeltaY( slitWidthModel );
            const latticeCenterY = this.lattice.height / 2;

            if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
              const low = j > latticeCenterY + slitWidth / 2;
              const high = j < latticeCenterY - slitWidth / 2;
              isCellInBarrier = low || high;
            }
            else if ( this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

              // Spacing is between center of slits.  This computation is done in model coordinates
              const topBarrierWidth = ( scene.waveAreaWidth - slitWidthModel - slitSeparationModel ) / 2;
              const centralBarrierWidth = scene.waveAreaWidth - 2 * topBarrierWidth - 2 * slitWidthModel;
              const inTop = y <= topBarrierWidth;
              const inBottom = y >= scene.waveAreaWidth - topBarrierWidth;
              const inCenter = ( y >= topBarrierWidth + slitWidthModel ) && ( y <= topBarrierWidth + slitWidthModel + centralBarrierWidth );
              isCellInBarrier = inTop || inBottom || inCenter;
            }
          }

          if ( this.button1PressedProperty.get() && !isCellInBarrier ) {

            // lambda * k = 2 * pi
            // k = 2pi/lambda
            const k = Math.PI * 2 / wavelength;

            // Scale the amplitude because it is calibrated for a point source, not a plane wave
            const angularFrequency = frequency * Math.PI * 2;
            let value = this.amplitudeProperty.get() * 0.21 * Math.sin( k * x - angularFrequency * this.time );

            if ( i >= frontPosition ) {
              value = 0;
            }
            const lastValue = lattice.getCurrentValue( i, j );
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
  }

  return waveInterference.register( 'SlitsScreenModel', SlitsScreenModel );
} );