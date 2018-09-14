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
  const IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  const Property = require( 'AXON/Property' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const WaterDrop = require( 'WAVE_INTERFERENCE/common/model/WaterDrop' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaterScene extends Scene {

    /**
     * @param {BooleanProperty} button1PressedProperty
     * @param {BooleanProperty} button2PressedProperty
     * @param {Object} config - see Scene for required properties
     */
    constructor( button1PressedProperty, button2PressedProperty, config ) {
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
      button1PressedProperty.link( pressed => {
        if ( pressed && !button2PressedProperty.value ) {
          this.lastDropTime = null; // prep to fire a new drop in the next frame
        }
      } );

      // prep to fire a new drop in the next frame, but only if the other source wasn't already setting the phase
      button2PressedProperty.link( pressed => {
        if ( pressed && !button1PressedProperty.value ) {
          this.lastDropTime = null;
        }
      } );
    }

    /**
     * Fire another water drop if one is warranted for the specified faucet.  We already determined that the timing
     * is right (for the period), now we need to know if a drop should fire.
     * @param {Property.<Boolean>} buttonProperty - indicates whether the corresponding button is pressed
     * @param {WavesScreenModel} model
     * @param {Property.<Boolean>} oscillatingProperty - indicates whether the wave source is oscillating
     * @param {number} sign - -1 for top faucet, +1 for bottom faucet
     * @private
     */
    launchWaterDrop( buttonProperty, model, oscillatingProperty, sign ) {

      const time = model.timeProperty.value;

      // Send a water drop if the button is pressed but not if the button is still pressed from the last pulse.
      // model.button1PressedProperty.value not consulted because we send a shutoff water drop. so that the previous
      // drop gets a full cycle
      const isPulseMode = model.inputTypeProperty.value === IncomingWaveType.PULSE;
      const firePulseDrop = isPulseMode && !model.pulseFiringProperty.value && model.button1PressedProperty.value;
      if ( !isPulseMode || firePulseDrop ) {

        // capture closure vars for when the water drop is absorbed.
        const buttonPressed = buttonProperty.value;
        const frequency = this.desiredFrequencyProperty.value;
        const amplitude = model.desiredAmplitudeProperty.value;
        const isPulse = model.inputTypeProperty.value === IncomingWaveType.PULSE;
        const sourceSeparation = this.desiredSourceSeparationProperty.value;
        this.waterDrops.push( new WaterDrop(
          amplitude,
          buttonPressed,
          sourceSeparation,
          100,
          sign,
          () => {

            if ( isPulse && model.pulseFiringProperty.value ) {
              return;
            }
            model.amplitudeProperty.set( amplitude );
            model.waterScene.frequencyProperty.set( frequency );
            this.sourceSeparationProperty.value = sourceSeparation;

            model.resetPhase();
            if ( isPulse ) {
              model.startPulse();
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
     * @param {WavesScreenModel} model
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( model, dt ) {

      super.step( model, dt );

      const time = model.timeProperty.value;
      const period = 1 / this.desiredFrequencyProperty.value;

      const timeSinceLastDrop = time - this.lastDropTime;

      // Emit water drops if the phase matches up, but not for the plane waves screen
      if ( !model.barrierTypeProperty && ( this.lastDropTime === null || timeSinceLastDrop > period ) ) {

        this.launchWaterDrop( model.button1PressedProperty, model, model.continuousWave1OscillatingProperty, +1 );
        this.launchWaterDrop( model.button2PressedProperty, model, model.continuousWave2OscillatingProperty, -1 );
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