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
      super();

      // @public {Property.<BarrierTypeEnum>} - type of the barrier in the lattice
      this.barrierTypeProperty = new Property( BarrierTypeEnum.ONE_SLIT );

      // When the barrier moves, it creates a lot of artifacts, so clear the wave when the barrier moves
      // TODO: restart propagation from the left
      const barrierMoved = this.clear.bind( this );
      this.waterScene.barrierLocationProperty.link( barrierMoved );
      this.soundScene.barrierLocationProperty.link( barrierMoved );
      this.lightScene.barrierLocationProperty.link( barrierMoved );
    }

    /**
     * Set the incoming source values, in this case it is a plane wave on the left side of the lattice.
     * @override
     * @protected
     */
    setSourceValues() {
      const lattice = this.lattice;

      const scene = this.sceneProperty.get();
      const barrierLatticeX = scene.modelToLatticeTransform.modelToViewX( scene.getBarrierLocation() );
      const slitSeparationModel = scene.slitSeparationProperty.get();

      // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
      // and unwanted artifacts

      for ( let i = 0; i <= barrierLatticeX; i++ ) {

        // Find the physical model coordinate corresponding to the lattice coordinate
        const x = scene.modelToLatticeTransform.viewToModelX( i );

        const frequency = scene.frequencyProperty.get();
        const wavelength = scene.waveSpeed / frequency * Math.PI * 2; // TODO: this in incorrect for sound and light

        for ( let j = 0; j < lattice.height; j++ ) {
          const y = scene.modelToLatticeTransform.viewToModelY( j );

          // Zero out values in the barrier
          let isCellInBarrier = false;

          if ( i === barrierLatticeX ) {

            const slitWidthModel = scene.slitWidthProperty.get();
            const slitWidth = scene.modelToLatticeTransform.modelToViewDeltaY( slitWidthModel );
            const latticeCenterY = this.lattice.height / 2;

            // TODO: NO_SLIT should just propagate the plane wave across the entire wave area to avoid artifacts

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

            // TODO: use wave speed to track the wavefront and back, there is an issue for this

            // Scale the amplitude because it is calibrated for a point source, not a plane wave
            const value = this.amplitudeProperty.get() * 0.21 * Math.sin( k * x - frequency * this.time );
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