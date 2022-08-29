// Copyright 2018-2022, University of Colorado Boulder

/**
 * The model for the Light scene, which adds the intensity sampling for the screen at the right hand side.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import waveInterference from '../../waveInterference.js';
import IntensitySample from './IntensitySample.js';
import Scene, { SceneOptions } from './Scene.js';

class LightScene extends Scene {

  // reads out the intensity on the right hand side of the lattice
  // While this is annotated as 'read-only' for assignment, it can be mutated by clients.
  public readonly intensitySample: IntensitySample;
  public readonly soundEffectEnabledProperty = new BooleanProperty( false );

  /**
   * @param config - see Scene for required properties
   */
  public constructor( config: SceneOptions ) {
    super( config );

    this.intensitySample = new IntensitySample( this.lattice );
  }

  /**
   * Don't play the wave generator button sound if another sound would be generated, or if another sound is ending due
   * to the button press.
   */
  public override waveGeneratorButtonSound( pressed: boolean ): void {
    if ( !this.soundEffectEnabledProperty.value ) {
      super.waveGeneratorButtonSound( this.button1PressedProperty.value );
    }
  }

  /**
   * The wave area resets when the wavelength changes in the light scene
   */
  protected override handlePhaseChanged(): void {
    this.clear();
  }

  /**
   * Clears the scene.
   */
  public override clear(): void {
    super.clear();

    // Permit calls to clear before subclass is initialized
    this.intensitySample && this.intensitySample.clear();
  }

  public override advanceTime( wallDT: number, manualStep: boolean ): void {
    super.advanceTime( wallDT, manualStep );
    this.intensitySample.step();
  }

  public override reset(): void {
    super.reset();
    this.soundEffectEnabledProperty.reset();
  }
}

waveInterference.register( 'LightScene', LightScene );
export default LightScene;