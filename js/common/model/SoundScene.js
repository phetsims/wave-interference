// Copyright 2018-2020, University of Colorado Boulder

/**
 * The model for the Sound scene, which adds SoundParticle instances.  See the following pages for visualizations
 * and physics of wave transmission
 * http://homepage.physics.uiowa.edu/~fskiff/Physics_044/Some%20more%20details%20on%20Sound.pdf
 * https://www.npr.org/2014/04/09/300563606/what-does-sound-look-like
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import Scene from './Scene.js';
import SoundParticle from './SoundParticle.js';

// constants
const SOUND_PARTICLE_GRADIENT_FORCE_SCALE = 0.67; // Additional scaling for the gradient force

class SoundScene extends Scene {

  /**
   * @param {boolean} showSoundParticles - true if SoundParticles should be created and displayed
   * @param {Object} config - see Scene for required properties
   */
  constructor( showSoundParticles, config ) {
    super( config );

    // @public (read-only) {boolean} - true if SoundParticles should be created and displayed.  They are not displayed
    // on the Slits screen, see https://github.com/phetsims/wave-interference/issues/109
    this.showSoundParticles = showSoundParticles;

    // @public - indicates the selected view for sound
    this.soundViewTypeProperty = new Property( SoundScene.SoundViewType.WAVES, {
      validValues: SoundScene.SoundViewType.VALUES
    } );

    // @public (read-only) {SoundParticle[]} particles for the sound scene.
    this.soundParticles = [];

    // @public - indicates whether the user has selected to hear the sine wave
    this.isTonePlayingProperty = new BooleanProperty( false );

    if ( this.showSoundParticles ) {

      const SOUND_PARTICLE_ROWS = 20;
      const SOUND_PARTICLE_COLUMNS = 20;
      const RANDOM_RADIUS = 2;
      for ( let i = 0; i <= SOUND_PARTICLE_ROWS; i++ ) {
        for ( let k = 0; k <= SOUND_PARTICLE_COLUMNS; k++ ) {
          this.soundParticles.push( new SoundParticle(
            i, k,
            i * this.waveAreaWidth / SOUND_PARTICLE_ROWS + phet.joist.random.nextGaussian() * RANDOM_RADIUS,
            k * this.waveAreaWidth / SOUND_PARTICLE_COLUMNS + phet.joist.random.nextGaussian() * RANDOM_RADIUS
          ) );
        }
      }
    }
  }

  /**
   * The SoundScene always generates the speaker membrane sound, so no sound should be played when the wave generator
   * button is pressed.
   * @public
   * @override
   */
  waveGeneratorButtonSound( pressed ) {

    // no-op
  }

  /**
   * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
   * @param {number} dt - amount of time to move forward, in the units of the scene
   * @override
   * @public
   */
  step( dt ) {

    super.step( dt );

    if ( this.showSoundParticles ) {
      const lattice = this.lattice;

      // Increase the gradient force at low frequencies so we can still see the waves clearly.
      const k = Utils.linear(
        this.frequencyProperty.range.min,
        this.frequencyProperty.range.max,
        130,
        76,
        this.frequencyProperty.value
      ) * SOUND_PARTICLE_GRADIENT_FORCE_SCALE;

      for ( let i = 0; i < this.soundParticles.length; i++ ) {
        const soundParticle = this.soundParticles[ i ];

        // Find the lattice coordinate of the current location of the particle.  Use rounding for consistency with
        // other quantization
        const latticeCoordinate = this.modelToLatticeTransform.modelToViewXY( soundParticle.x, soundParticle.y );
        const latticeX = Utils.roundSymmetric( latticeCoordinate.x );
        const latticeY = Utils.roundSymmetric( latticeCoordinate.y );

        // Estimate the numerical gradient in the neighborhood of the particle
        // https://en.wikipedia.org/wiki/Pressure-gradient_force
        // https://en.wikipedia.org/wiki/Gradient
        // https://en.wikipedia.org/wiki/Numerical_differentiation

        // estimate the spatial derivative in the x-direction
        const fx2 = lattice.getCurrentValue( latticeX + 1, latticeY );
        const fx1 = lattice.getCurrentValue( latticeX - 1, latticeY );
        const gradientX = ( fx2 - fx1 ) / 2;

        // estimate the spatial derivative in the y-direction
        const fy2 = lattice.getCurrentValue( latticeX, latticeY + 1 );
        const fy1 = lattice.getCurrentValue( latticeX, latticeY - 1 );
        const gradientY = ( fy2 - fy1 ) / 2;

        const fx = gradientX * k;
        const fy = gradientY * k;
        if ( !isNaN( fx ) && !isNaN( fy ) ) {
          soundParticle.applyForce(
            fx * WaveInterferenceConstants.CALIBRATION_SCALE,
            fy * WaveInterferenceConstants.CALIBRATION_SCALE,
            dt, this
          );
        }
      }
    }
  }

  /**
   * Restores the initial conditions of this scene.
   * @public
   */
  reset() {
    super.reset();
    this.soundViewTypeProperty.reset();
    this.isTonePlayingProperty.reset();
  }
}

/**
 * @public
 */
SoundScene.SoundViewType = Enumeration.byKeys( [ 'WAVES', 'PARTICLES', 'BOTH' ] );

waveInterference.register( 'SoundScene', SoundScene );
export default SoundScene;