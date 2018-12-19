// Copyright 2018, University of Colorado Boulder

//REVIEW I don't understand the "When selected" bit.
//REVIEW*: I meant to indicate that the sound particles are only updated and displayed when the user
//REVIEW*: has selected the "sound" scene and one of the two options that display particles.
//REVIEW*: Can you recommend the best way to indicate this?
/**
 * When selected, shows discrete, moving particles for the sound scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  //REVIEW RANDOMNESS value needs more explanation - range, effect of increase/decrease,...
  //REVIEW* Updated, please review.
  // At each time step, a random force is applied in both the x and y directions.  The magnitude of the force
  // in each direction is is a random value between -RANDOMNESS and +RANDOMNESS.  This is to show
  // motion even in the absence of waves, since we are not at absolute zero.
  const RANDOMNESS = 14.75;

  //REVIEW FRICTION_SCALE needs more explanation, since 1 = no friction is not what I would have expected
  //REVIEW* I added docs, is this clearer?  Let me know if there's a better way to do this, or clearer variable names.
  // At each time step, the velocity is multiplied FRICTION_SCALE.  If FRICTION_SCALE is 1, that means the velocity is
  // not damped out at all.  For a value < 1, this amounts to exponential decay in the speed.
  const FRICTION_SCALE = 0.732;
  const RESTORATION_FORCE_SCALE = 0.5; // Additional scaling for the home force

  class SoundParticle {

    /**
     * @param {number} i - horizontal lattice coordinate of the particle
     * @param {number} j - vertical lattice coordinate of the particle
     * @param {number} x - initial x coordinate of the particle, in model coordinates
     * @param {number} y - initial y coordinate of the particle, in model coordinates
     */
    constructor( i, j, x, y ) {

      //REVIEW I don't see assignments to i,j,x,y anywhere.  Should these be read-only?
      // @public (read-only) {number} - horizontal lattice coordinate of the particle
      this.i = i;

      // @public (read-only) {number} - vertical lattice coordinate of the particle
      this.j = j;

      // @public (read-only) {number} - x coordinate
      this.x = x;

      // @public (read-only) {number} - y coordinate
      this.y = y;

      // @private (read-only)
      this.initialX = x;

      // @private (read-only)
      this.initialY = y;

      // @private
      this.vx = 0;

      // @private
      this.vy = 0;
    }

    //REVIEW missing visibility annotation
    //REVIEW* Added, thanks!
    /**
     * Applies a force toward the given point with the given strength;
     * @param {number} fx - sum of applied forces in the x direction
     * @param {number} fy - sum of applied forces in the y direction
     * @param {number} dt - time to integrate
     * @param {SoundScene} soundScene - to get the frequency range and value
     * @public
     */
    applyForce( fx, fy, dt, soundScene ) {

      // the particles move randomly even when there are no waves, because they are not at absolute zero
      // see https://github.com/phetsims/wave-interference/issues/123
      fx += ( phet.joist.random.nextDouble() - 0.5 ) * 2 * RANDOMNESS;
      fy += ( phet.joist.random.nextDouble() - 0.5 ) * 2 * RANDOMNESS;

      // use the airK as the magnitude and the forceCenter for direction only.
      const restorationSpringConstant = Util.linear(
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

  return waveInterference.register( 'SoundParticle', SoundParticle );
} );