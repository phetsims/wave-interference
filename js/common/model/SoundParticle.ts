// Copyright 2018-2022, University of Colorado Boulder

/**
 * When the sound wave generator is selected, shows discrete, moving particles for the sound scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import waveInterference from '../../waveInterference.js';
import SoundScene from './SoundScene.js';

// constants
// At each time step, a random force is applied in both the x and y directions.  The magnitude of the force
// in each direction is is a random value between -RANDOMNESS and +RANDOMNESS.  This is to show
// motion even in the absence of waves, since we are not at absolute zero.
const RANDOMNESS = 14.75;

// At each time step, the velocity is multiplied by FRICTION_SCALE.  If FRICTION_SCALE is 1, that means the velocity is
// not damped out at all.  For a value < 1, this amounts to exponential decay in the speed.
const FRICTION_SCALE = 0.732;
const RESTORATION_FORCE_SCALE = 0.5; // Additional scaling for the home force

class SoundParticle {
  private readonly initialX: number;
  private readonly initialY: number;
  private vx: number;
  private vy: number;

  /**
   * @param i - horizontal lattice coordinate of the particle
   * @param j - vertical lattice coordinate of the particle
   * @param x - initial x coordinate of the particle, in model coordinates
   * @param y - initial y coordinate of the particle, in model coordinates
   */
  public constructor( public readonly i: number, public readonly j: number, public x: number, public y: number ) {
    this.initialX = x;
    this.initialY = y;
    this.vx = 0;
    this.vy = 0;
  }

  /**
   * Applies a force toward the given point with the given strength;
   * @param fx - sum of applied forces in the x direction
   * @param fy - sum of applied forces in the y direction
   * @param dt - time to integrate
   * @param soundScene - to get the frequency range and value
   */
  public applyForce( fx: number, fy: number, dt: number, soundScene: SoundScene ): void {

    // the particles move randomly even when there are no waves, because they are not at absolute zero
    // see https://github.com/phetsims/wave-interference/issues/123
    fx += ( dotRandom.nextDouble() - 0.5 ) * 2 * RANDOMNESS;
    fy += ( dotRandom.nextDouble() - 0.5 ) * 2 * RANDOMNESS;

    // use the airK as the magnitude and the forceCenter for direction only.
    const restorationSpringConstant = Utils.linear(
      soundScene.frequencyProperty.range.min, soundScene.frequencyProperty.range.max,
      ( 2 * 1.05 ), ( 6.5 * 0.8 ),
      soundScene.frequencyProperty.value
    ) * RESTORATION_FORCE_SCALE;
    const fSpringX = -restorationSpringConstant * ( this.x - this.initialX );
    const fSpringY = -restorationSpringConstant * ( this.y - this.initialY );
    this.vx += fx + fSpringX;
    this.vy += fy + fSpringY;

    // friction
    this.vx *= FRICTION_SCALE;
    this.vy *= FRICTION_SCALE;

    // motion
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

waveInterference.register( 'SoundParticle', SoundParticle );
export default SoundParticle;