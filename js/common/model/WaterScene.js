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
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const WaterDrop = require( 'WAVE_INTERFERENCE/common/model/WaterDrop' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveSpatialType = require( 'WAVE_INTERFERENCE/common/model/WaveSpatialType' );
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  class WaterScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      //REVIEW add value validation? range: this.frequencyProperty.range ?
      //REVIEW* Please see question in Scene.sourceSeparationProperty REVIEW* comment
      // @public - In the water Scene, the user specifies the desired frequency and amplitude, and that
      // gets propagated to the lattice via the water drops
      this.desiredFrequencyProperty = new NumberProperty( this.frequencyProperty.initialValue );

      //REVIEW add value validation?
      //REVIEW* Please see question in Scene.sourceSeparationProperty REVIEW* comment
      // @public - In the water Scene, the user specifies the desired source separation.  This is the position of
      // the faucets.  The sourceSeparationProperty indicates the sources of oscillation once the water has struck.
      this.desiredSourceSeparationProperty = new NumberProperty( this.sourceSeparationProperty.value );

      //REVIEW add value validation?
      //REVIEW* Please see question in Scene.sourceSeparationProperty REVIEW* comment
      // @public - the amplitude the user has selected
      this.desiredAmplitudeProperty = new NumberProperty( config.initialAmplitude );

      // @public (read-only) {WaterDrop[]} drops of water that are falling from the hose to the lattice.
      this.waterDrops = [];

      //REVIEW what is "the phase"? units, range and semantics of values,...
      //REVIEW* I added docs, please review.
      // @private {number|null} - record the time (in seconds) that the previous water drop was emitted, so the next
      // drop (or drops, in the case of two emitters) can be emitted at the appropriate time.  Null means no drops have
      // been emitted.
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

      // For the water scene, remove water drops so one mode doesn't create waves in the other mode
      this.waveTemporalTypeProperty.link( inputType => this.removeAllDrops() );
    }

    /**
     * Fire another water drop if one is warranted for the specified faucet.  We already determined that the timing
     * is right (for the period), now we need to know if a drop should fire.
     * @param {BooleanProperty} buttonProperty - indicates whether the corresponding button is pressed
     * @param {BooleanProperty} oscillatingProperty - indicates whether the wave source is oscillating
     * @param {number} sign - -1 for top faucet, +1 for bottom faucet
     * @private
     */
    launchWaterDrop( buttonProperty, oscillatingProperty, sign ) {

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
          100, //REVIEW^ magic number? param is y - distance to fall before the particles meets the plane of the lattice
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
        this.updateIsAboutToFire();
        this.lastDropTime = time;
      }
    }

    //REVIEW missing visibility annotation
    //REVIEW* Added, please review
    /**
     * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
     * @param {number} dt - amount of time to move forward, in the units of the scene
     * @override
     * @public
     */
    step( dt ) {

      super.step( dt );

      const time = this.timeProperty.value;

      // Use the lattice frequency (rather than the desired frequency) to determine the time of the next drop
      // so the next drop will not take too long, see https://github.com/phetsims/wave-interference/issues/154
      const period = 1 / this.frequencyProperty.value;

      const timeSinceLastDrop = time - this.lastDropTime;

      // Emit water drops if the phase matches up, but not for the plane waves screen
      if ( this.waveSpatialType === WaveSpatialType.POINT &&
           ( this.lastDropTime === null || timeSinceLastDrop > period ) ) {

        this.launchWaterDrop( this.button1PressedProperty, this.continuousWave1OscillatingProperty, +1 );
        this.launchWaterDrop( this.button2PressedProperty, this.continuousWave2OscillatingProperty, -1 );
      }

      const toRemove = [];
      for ( let i = 0; i < this.waterDrops.length; i++ ) {
        const waterDrop = this.waterDrops[ i ];

        // Tuned so that the wave goes underwater when the drop hits
        waterDrop.step( dt );

        // Remove any water drops that went below y=0
        if ( waterDrop.y < 0 ) {
          toRemove.push( waterDrop );
        }
      }
      for ( let i = 0; i < toRemove.length; i++ ) {
        arrayRemove( this.waterDrops, toRemove[ i ] );
      }

      this.updateIsAboutToFire();
    }

    /**
     * When any water drop with a nonzero amplitude that is a trigger to start oscillation exists,
     * we mark the isAboutToFireProperty as true.
     * @private
     */
    updateIsAboutToFire() {
      let isAboutToFire = false;

      // Called every frame, do not allocate closures.
      for ( let i = 0; i < this.waterDrops.length; i++ ) {
        const waterDrop = this.waterDrops[ i ];
        if ( waterDrop.amplitude > 0 && waterDrop.startsOscillation ) {

          // Called every frame, break when any match is found for performance
          isAboutToFire = true;
          break;
        }
      }
      this.isAboutToFireProperty.value = isAboutToFire;
    }

    /**
     * Clear all of the water drops.
     * @public
     */
    removeAllDrops() {
      while ( this.waterDrops.length > 0 ) {
        arrayRemove( this.waterDrops, this.waterDrops[ 0 ] );
      }
    }

    /**
     * Reset additional features.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.desiredFrequencyProperty.reset();
      this.desiredSourceSeparationProperty.reset();
      this.desiredAmplitudeProperty.reset();
      while ( this.waterDrops.length > 0 ) {
        arrayRemove( this.waterDrops, this.waterDrops[ 0 ] );
      }
    }
  }

  return waveInterference.register( 'WaterScene', WaterScene );
} );