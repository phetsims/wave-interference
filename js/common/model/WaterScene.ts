// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * The model for the Water scene, which adds WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import Scene, { SceneOptions } from './Scene.js';
import WaterDrop from './WaterDrop.js';

type SelfOptions = EmptySelfOptions;
type WaterSceneOptions = SelfOptions & SceneOptions;

class WaterScene extends Scene {

  // the amplitude the user has selected
  public readonly desiredAmplitudeProperty: NumberProperty;

  /**
   * @param config - see Scene for required properties
   */
  public constructor( config: WaterSceneOptions ) {
    super( config );

    // @public - Emits when a water drop hits the y=0 plane
    this.waterDropAbsorbedEmitter = new Emitter( { parameters: [ { valueType: WaterDrop } ] } );

    // @public - In the water Scene, the user specifies the desired frequency and amplitude, and that
    // gets propagated to the lattice via the water drops
    this.desiredFrequencyProperty = new NumberProperty( this.frequencyProperty.initialValue, {
      range: this.frequencyProperty.range
    } );

    // @public - In the water Scene, the user specifies the desired source separation.  This is the position of
    // the faucets.  The sourceSeparationProperty indicates the sources of oscillation once the water has struck.
    this.desiredSourceSeparationProperty = new NumberProperty( this.sourceSeparationProperty.value, {
      range: config.sourceSeparationRange
    } );

    this.desiredAmplitudeProperty = new NumberProperty( config.initialAmplitude, {
      range: this.amplitudeProperty.range
    } );

    // @public (read-only) {WaterDrop[]} drops of water that are falling from the hose to the lattice.
    this.waterDrops = [];

    // @private {number|null} - record the time (in seconds) that the previous water drop was emitted, so the next
    // drop (or drops, in the case of two wave generators) can be emitted at the appropriate time.  Null means no
    // drops have fallen.
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
    this.disturbanceTypeProperty.link( () => this.removeAllDrops() );
  }

  /**
   * Fire another water drop if one is warranted for the specified faucet.  We already determined that the timing
   * is right (for the period), now we need to know if a drop should fire.
   * @param buttonProperty - indicates whether the corresponding button is pressed
   * @param oscillatingProperty - indicates whether the wave source is oscillating
   * @param sign - -1 for top faucet, +1 for bottom faucet
   */
  private launchWaterDrop( buttonProperty, oscillatingProperty, sign ): void {

    const time = this.timeProperty.value;

    // Send a water drop if the button is pressed but not if the button is still pressed from the last pulse.
    // model.button1PressedProperty.value not consulted because we send a shutoff water drop. so that the previous
    // drop gets a full cycle
    const isPulseMode = this.disturbanceTypeProperty.value === Scene.DisturbanceType.PULSE;
    const firePulseDrop = isPulseMode && !this.pulseFiringProperty.value && this.button1PressedProperty.value;
    if ( !isPulseMode || firePulseDrop ) {

      // capture closure vars for when the water drop is absorbed.
      const buttonPressed = buttonProperty.value;
      const frequency = this.desiredFrequencyProperty.value;
      const amplitude = this.desiredAmplitudeProperty.value;
      const isPulse = this.disturbanceTypeProperty.value === Scene.DisturbanceType.PULSE;

      // Distance between the sources, or 0 if there is only 1 source
      const sourceSeparation = this.numberOfSources === 2 ? this.desiredSourceSeparationProperty.value : 0;
      this.waterDrops.push( new WaterDrop(
        amplitude,
        buttonPressed,
        sourceSeparation,
        sign,
        () => {

          if ( isPulse && this.pulseFiringProperty.value ) {
            return;
          }
          this.amplitudeProperty.set( amplitude );
          this.frequencyProperty.set( frequency );

          // Separate the sources (if there are two of them)
          if ( this.numberOfSources === 2 ) {
            this.sourceSeparationProperty.value = sourceSeparation;
          }

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

  /**
   * Override to clear water drops when muted.
   */
  public override setMuted( muted: boolean ): void {
    super.setMuted( muted );
    muted && this.removeAllDrops();
    this.continuousWave1OscillatingProperty.value = false;
    this.continuousWave2OscillatingProperty.value = false;
  }

  /**
   * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
   * @param dt - amount of time to move forward, in the units of the scene
   */
  public override step( dt: number ): void {

    super.step( dt );

    const time = this.timeProperty.value;

    // Use the lattice frequency (rather than the desired frequency) to determine the time of the next drop
    // so the next drop will not take too long, see https://github.com/phetsims/wave-interference/issues/154
    const period = 1 / this.frequencyProperty.value;

    const timeSinceLastDrop = time - this.lastDropTime;

    // Emit water drops if the phase matches up, but not for the plane waves screen
    if ( this.waveSpatialType === Scene.WaveSpatialType.POINT &&
         ( this.lastDropTime === null || timeSinceLastDrop > period ) &&
         !this.muted ) {

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
        if ( waterDrop.amplitude > 0 && waterDrop.startsOscillation ) {
          this.waterDropAbsorbedEmitter.emit( waterDrop );
        }
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
   */
  private updateIsAboutToFire(): void {
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
   * Gets the wavelength specified by the user in the control panel.
   * @returns in cm/sec
   */
  public getDesiredWavelength(): number {
    return this.waveSpeed / this.desiredFrequencyProperty.get();
  }

  protected override handleButton1Toggled( isPressed: boolean ): void {
    // Override as a no-op, since water controls the source via WaterDrops hitting the surface
  }

  protected override handleButton2Toggled( isPressed: boolean ): void {
    // Override as a no-op, since water controls the source via WaterDrops hitting the surface
  }

  /**
   * Gets the horizontal coordinate where water drops come out--aligned with the oscillation cell.
   */
  public getWaterDropX(): number {

    // Note this is nudged over 1/2 a cell so it will appear in the center of the cell rather than
    // at the left edge of the cell.  See also WaveInterferenceUtils.getWaterSideShape.
    return this.latticeToViewTransform.modelToViewX(
      WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE + 0.5
    );
  }

  /**
   * Clear all of the water drops.
   */
  public removeAllDrops(): void {
    while ( this.waterDrops.length > 0 ) {
      arrayRemove( this.waterDrops, this.waterDrops[ 0 ] );
    }
  }

  /**
   * Reset additional features.
   */
  public override reset(): void {
    super.reset();
    this.desiredFrequencyProperty.reset();
    this.desiredSourceSeparationProperty.reset();
    this.desiredAmplitudeProperty.reset();
    while ( this.waterDrops.length > 0 ) {
      arrayRemove( this.waterDrops, this.waterDrops[ 0 ] );
    }
  }
}

waveInterference.register( 'WaterScene', WaterScene );
export default WaterScene;