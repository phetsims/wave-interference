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
      if ( ( lastDropTime === null || timeSinceLastDrop > period ) && model.button1PressedProperty.value ) {

        // Send a drop with 0 amplitude to signal the wave source to stop oscillating, so that the previous drop
        // gets a full cycle
        // capture closure vars for when the water drop is absorbed.
        const buttonPressed = model.button1PressedProperty.value;
        const frequency = this.desiredFrequencyProperty.value;
        const amplitude = model.desiredAmplitudeProperty.value;
        const property = model.continuousWave1OscillatingProperty; // TODO: the water drop should know which wave to turn on
        this.waterDrops.push( new WaterDrop(
          amplitude,
          buttonPressed,
          -1, // TODO: targetCellJ
          100,
          () => {

            // TODO: should the drop know when it should turn on a pulse?  I think so.
            // TODO: or pass an "onAbsorbed" function?
            property.value = buttonPressed;

            // TODO: can we avoid this check?  Maybe it doesn't hurt anything to change the desired amplitude/frequency
            // if the oscillation is turned off
            // TODO: why does turning on one pulse cause oscillations right away?
            if ( buttonPressed ) {

              // TODO: once we add a separate flag for shutoff, we may not need a check here?
              // TODO: this impacts the "pulse" feature
              model.amplitudeProperty.set( amplitude );

              model.waterScene.frequencyProperty.set( frequency );
            }
          }
        ) );
        lastDropTime = time;
      }

      // TODO: water drops shouldn't show for plane waves.  This may be accomplished by a different source button
      // that is wired directly to the oscillator

      const toRemove = [];
      for ( let waterDrop of this.waterDrops ) {

        // Tuned so that the wave goes underwater when the drop hits
        waterDrop.step( dt );
        if ( waterDrop.y < 0 ) {

          // TODO: what if the water is below y=0 in side view--then we would want them to have the same effect on the
          // lattice but still show in the view.  This is getting complicated.
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