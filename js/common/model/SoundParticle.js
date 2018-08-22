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
     * @param fx
     * @param fy
     */
    applyForce( fx, fy ) {

      // TODO: this could use some tuning.
      const k = 0.1;

      // use the airK as the magnitude and the forceCenter for direction only.
      // TODO: move motion into this part as well
      const fSpringX = -k * ( this.x - this.initialX );
      const fSpringY = -k * ( this.y - this.initialY );
      this.vx += fx + fSpringX;
      this.vy += fy + fSpringY;

      // friction
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }

  return waveInterference.register( 'SoundParticle', SoundParticle );
} );