// Copyright 2018, University of Colorado Boulder

//REVIEW I don't understand the "When selected" bit.
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
  const RANDOMNESS = 14.75; // The random motion of the particles
  //REVIEW FRICTION_SCALE needs more explanation, since 1 = no friction is not what I would have expected
  const FRICTION_SCALE = 0.732; // Scaling factor for friction (1.0 = no friction)
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
      // @public {number} - horizontal lattice coordinate of the particle
      this.i = i;

      // @public {number} - vertical lattice coordinate of the particle
      this.j = j;

      // @public {number} - x coordinate
      this.x = x;

      // @public {number} - y coordinate
      this.y = y;

      // @private
      this.initialX = x;
      this.initialY = y;
      this.vx = 0;
      this.vy = 0;
    }

    //REVIEW missing visibility annotation
    /**
     * Applies a force toward the given point with the given strength;
     * @param {number} fx - sum of applied forces in the x direction
     * @param {number} fy - sum of applied forces in the y direction
     * @param {number} dt - time to integrate
     * @param {SoundScene} soundScene - to get the frequency range and value
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