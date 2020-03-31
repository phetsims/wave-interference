// Copyright 2018-2020, University of Colorado Boulder

/**
 * The model for the Light scene, which adds the intensity sampling for the screen at the right hand side.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceQueryParameters from '../WaveInterferenceQueryParameters.js';
import IntensitySample from './IntensitySample.js';
import Scene from './Scene.js';

class LightScene extends Scene {

  /**
   * @param {Object} config - see Scene for required properties
   */
  constructor( config ) {
    super( config );

    // @public (read-only) reads out the intensity on the right hand side of the lattice
    // While this is annotated as 'read-only' for assignment, it can be mutated by clients.
    this.intensitySample = new IntensitySample( this.lattice );

    // @public
    this.soundEffectEnabledProperty = new BooleanProperty( WaveInterferenceQueryParameters.lightSonification );
  }

  /**
   * Don't play the wave generator button sound if another sound would be generated, or if another sound is ending due
   * to the button press.
   * @public
   * @override
   */
  waveGeneratorButtonSound( pressed ) {
    if ( !this.soundEffectEnabledProperty.value ) {
      super.waveGeneratorButtonSound( this.button1PressedProperty.value );
    }
  }

  /**
   * The wave area resets when the wavelength changes in the light scene
   * @protected
   */
  handlePhaseChanged() {
    this.clear();
  }

  /**
   * Clears the scene.
   * @public
   * @override
   */
  clear() {
    super.clear();

    // Permit calls to clear before subclass is initialized
    this.intensitySample && this.intensitySample.clear();
  }

  /**
   * @param wallDT
   * @param manualStep
   * @public
   * @override
   */
  advanceTime( wallDT, manualStep ) {
    super.advanceTime( wallDT, manualStep );
    this.intensitySample.step();
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.soundEffectEnabledProperty.reset();
  }
}

waveInterference.register( 'LightScene', LightScene );
export default LightScene;