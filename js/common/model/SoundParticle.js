// Copyright 2018, University of Colorado Boulder

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
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class SoundParticle {

    /**
     * @param {number} i - horizontal lattice coordinate of the particle
     * @param {number} j - vertical lattice coordinate of the particle
     * @param {number} x - initial x coordinate of the particle, in model coordinates
     * @param {number} y - initial y coordinate of the particle, in model coordinates
     */
    constructor( i, j, x, y ) {

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

    /**
     * Applies a force toward the given point with the given strength;
     * @param {number} fx - sum of applied forces in the x direction
     * @param {number} fy - sum of applied forces in the y direction
     * @param {number} dt - time to integrate
     * @param {SoundScene} soundScene - to get the frequency range and value
     */
    applyForce( fx, fy, dt, soundScene ) {

      const RANDOMNESS = WaveInterferenceConstants.SOUND_PARTICLE_RANDOMNESS_PROPERTY.get();

      // the particles move randomly even when there are no waves, because they are not at absolute zero
      // see https://github.com/phetsims/wave-interference/issues/123
      fx += ( phet.joist.random.nextDouble() - 0.5 ) * 2 * RANDOMNESS;
      fy += ( phet.joist.random.nextDouble() - 0.5 ) * 2 * RANDOMNESS;

      // use the airK as the magnitude and the forceCenter for direction only.
      const restorationSpringConstant = Util.linear(
        soundScene.frequencyProperty.range.min, soundScene.frequencyProperty.range.max,
        ( 2 * 1.05 ), ( 6.5 * 0.8 ),
        soundScene.frequencyProperty.value
      ) * WaveInterferenceConstants.SOUND_PARTICLE_RESTORATION_SCALE.get();
      const fSpringX = -restorationSpringConstant * ( this.x - this.initialX );
      const fSpringY = -restorationSpringConstant * ( this.y - this.initialY );
      this.vx += fx + fSpringX;
      this.vy += fy + fSpringY;

      // friction
      const FRICTION_SCALE = WaveInterferenceConstants.SOUND_PARTICLE_FRICTION_SCALE_PROPERTY.get();
      this.vx *= FRICTION_SCALE;
      this.vy *= FRICTION_SCALE;

      // motion
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }
  }

  return waveInterference.register( 'SoundParticle', SoundParticle );
} );