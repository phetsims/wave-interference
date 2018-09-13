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

  // TODO: use correct physics for drop emit times, and will need this for both drops
  let lastDropTime = null;

  class WaterScene extends Scene {

    /**
     * @param {BooleanProperty} button1PressedProperty
     * @param {Object} config - see Scene for required properties
     */
    constructor( button1PressedProperty, config ) {
      super( config );

      // @public - In the water Scene, the user specifies the desired frequency and amplitude, and that
      // gets propagated to the lattice via the water drops
      this.desiredFrequencyProperty = new Property( this.initialFrequency );

      // @public - In the water Scene, the user specifies the desired source separation.  This is the position of
      // the faucets.  The sourceSeparationProperty indicates the sources of oscillation once the water has struck.
      this.desiredSourceSeparationProperty = new Property( this.sourceSeparationProperty.value );

      // @public (read-only) {WaterDrop[]} drops of water that are falling from the hose to the lattice.
      this.waterDrops = [];

      // TODO: same thing for button2Pressed
      button1PressedProperty.link( button1Pressed => {
        if ( button1Pressed ) {
          lastDropTime = null; // prep to fire a new drop in the next frame
        }
      } );
    }

    /**
     * Fire another water drop if one is warranted for the specified faucet.  We already determined that the timing
     * is right (for the period), now we need to know if a drop should fire.
     * TODO: JSDoc
     * @param {WavesScreenModel} model
     * @private
     */
    launchWaterDrop( buttonProperty, model, oscillatingProperty, side ) {

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
          side,
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
        lastDropTime = time;
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

      // TODO: support the top and bottom faucets
      const timeSinceLastDrop = time - lastDropTime;
      if ( lastDropTime === null || timeSinceLastDrop > period ) {

        // TODO: support the top and bottom faucets
        this.launchWaterDrop( model.button1PressedProperty, model, model.continuousWave1OscillatingProperty, 'bottom' );
        this.launchWaterDrop( model.button2PressedProperty, model, model.continuousWave2OscillatingProperty, 'top' );
      }

      // TODO: water drops shouldn't show for plane waves.  This may be accomplished by a different source button
      // that is wired directly to the oscillator

      const toRemove = [];
      for ( let waterDrop of this.waterDrops ) {

        // Tuned so that the wave goes underwater when the drop hits
        waterDrop.step( dt );

        // Remove any water drops that went below y=0
        // TODO: what if the water is below y=0 in side view--then we would want them to have the same effect on the
        // lattice but still show in the view.  This is getting complicated.
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