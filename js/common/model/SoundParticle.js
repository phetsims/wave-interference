// Copyright 2018, University of Colorado Boulder

/**
 * When selected, shows discrete, moving particles for the sound scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SoundParticle {

    /**
     * @param {number} x - initial x coordinate of the particle, in model coordinates
     * @param {number} y - initial y coordinate of the particle, in model coordinates
     */
    constructor( x, y ) {

      // @public - x coordinate
      this.x = x;

      // @public - y coordinate
      this.y = y;

      // @private
      this.initialX = x;
      this.initialY = y;
      this.vx = 0;
      this.vy = 0;
    }

    /**
     * Applies a force toward the given point with the given strength;
     * @param {number } fx - sum of applied forces in the x direction
     * @param {number} fy - sum of applied forces in the y direction
     * @param {number} dt - time to integrate
     */
    applyForce( fx, fy, dt ) {

      const restorationSpringConstant = 1.8;

      // use the airK as the magnitude and the forceCenter for direction only.
      const fSpringX = -restorationSpringConstant * ( this.x - this.initialX );
      const fSpringY = -restorationSpringConstant * ( this.y - this.initialY );
      this.vx += fx + fSpringX;
      this.vy += fy + fSpringY;

      // friction
      this.vx *= 0.9;
      this.vy *= 0.9;

      // motion
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }
  }

  return waveInterference.register( 'SoundParticle', SoundParticle );
} );