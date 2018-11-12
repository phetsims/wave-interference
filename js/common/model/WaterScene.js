// Copyright 2018, University of Colorado Boulder

/**
 * The model for the Water scene, which adds WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const arrayRemove = require( 'PHET_CORE/arrayRemove' );
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );
  const Property = require( 'AXON/Property' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const WaterDrop = require( 'WAVE_INTERFERENCE/common/model/WaterDrop' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveSpatialType = require( 'WAVE_INTERFERENCE/common/model/WaveSpatialType' );

  class WaterScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      // @public - In the water Scene, the user specifies the desired frequency and amplitude, and that
      // gets propagated to the lattice via the water drops
      this.desiredFrequencyProperty = new Property( this.initialFrequency );

      // @public - In the water Scene, the user specifies the desired source separation.  This is the position of
      // the faucets.  The sourceSeparationProperty indicates the sources of oscillation once the water has struck.
      this.desiredSourceSeparationProperty = new Property( this.sourceSeparationProperty.value );

      // @public (read-only) {WaterDrop[]} drops of water that are falling from the hose to the lattice.
      this.waterDrops = [];

      // @private {number|null} - sets the phase for both drops.  Null means no drops have been emitted.
      this.lastDropTime = null;

      // prep to fire a new drop in the next frame, but only if the other source wasn't already setting the phase
      this.button1PressedProperty.link( pressed => {
        if ( pressed && !this.button2PressedProperty.value ) {
          this.lastDropTime = null; // prep to fire a new drop in the next frame
        }
      } );

      // prep to fire a new drop in the next frame, but only if the other source wasn't already setting the phase
      this.button2PressedProperty.link( pressed => {
        if ( pressed && !this.button1PressedProperty.value ) {
          this.lastDropTime = null;
        }
      } );
    }

    /**
     * Fire another water drop if one is warranted for the specified faucet.  We already determined that the timing
     * is right (for the period), now we need to know if a drop should fire.
     * @param {Property.<Boolean>} buttonProperty - indicates whether the corresponding button is pressed
     * @param {Property.<Boolean>} oscillatingProperty - indicates whether the wave source is oscillating
     * @param {number} sign - -1 for top faucet, +1 for bottom faucet
     * @private
     */
    launchWaterDrop( buttonProperty, oscillatingProperty, sign ) { // TODO: eliminate model parameter

      const time = this.timeProperty.value;

      // Send a water drop if the button is pressed but not if the button is still pressed from the last pulse.
      // model.button1PressedProperty.value not consulted because we send a shutoff water drop. so that the previous
      // drop gets a full cycle
      const isPulseMode = this.waveTemporalTypeProperty.value === WaveTemporalType.PULSE;
      const firePulseDrop = isPulseMode && !this.pulseFiringProperty.value && this.button1PressedProperty.value;
      if ( !isPulseMode || firePulseDrop ) {

        // capture closure vars for when the water drop is absorbed.
        const buttonPressed = buttonProperty.value;
        const frequency = this.desiredFrequencyProperty.value;
        const amplitude = this.desiredAmplitudeProperty.value;
        const isPulse = this.waveTemporalTypeProperty.value === WaveTemporalType.PULSE;
        const sourceSeparation = this.desiredSourceSeparationProperty.value;
        this.waterDrops.push( new WaterDrop(
          amplitude,
          buttonPressed,
          sourceSeparation,
          100,
          sign,
          () => {

            if ( isPulse && this.pulseFiringProperty.value ) {
              return;
            }
            this.amplitudeProperty.set( amplitude );
            this.frequencyProperty.set( frequency );
            this.sourceSeparationProperty.value = sourceSeparation;

            this.resetPhase();
            if ( isPulse ) {
              this.startPulse();
            }
            else {
              oscillatingProperty.value = buttonPressed;
            }
          }
        ) );
        this.lastDropTime = time;
      }
    }

    /**
     * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( dt ) {

      super.step( dt );

      const time = this.timeProperty.value;

      // Use the lattice frequency (rather than the desired frequency) to determine the time of the next drop
      // so the next drop will not take too long, see https://github.com/phetsims/wave-interference/issues/154
      const period = 1 / this.frequencyProperty.value;

      const timeSinceLastDrop = time - this.lastDropTime;

      // Emit water drops if the phase matches up, but not for the plane waves screen
      if ( this.waveSpatialType === WaveSpatialType.POINT && ( this.lastDropTime === null || timeSinceLastDrop > period ) ) {

        this.launchWaterDrop( this.button1PressedProperty, this.continuousWave1OscillatingProperty, +1 );
        this.launchWaterDrop( this.button2PressedProperty, this.continuousWave2OscillatingProperty, -1 );
      }

      const toRemove = [];
      for ( let waterDrop of this.waterDrops ) {

        // Tuned so that the wave goes underwater when the drop hits
        waterDrop.step( dt );

        // Remove any water drops that went below y=0
        if ( waterDrop.y < 0 ) {
          toRemove.push( waterDrop );
        }
      }
      for ( let element of toRemove ) {
        arrayRemove( this.waterDrops, element );
      }
    }
  }

  return waveInterference.register( 'WaterScene', WaterScene );
} );