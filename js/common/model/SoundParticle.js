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
     * @param forceCenter
     * @param amount
     */
    applyForceTowards( forceCenter, amount ) {
      const k = 1.5;
      assert && assert( !isNaN( forceCenter.x ) );
      assert && assert( !isNaN( forceCenter.y ) );
      const airK = amount * 3;

      // use the airK as the magnitude and the forceCenter for direction only.
      // TODO: move motion into this part as well
      const fAirX = -airK * ( this.x - forceCenter.x ) / Math.abs( this.x - forceCenter.x );
      const fAirY = -airK * ( this.y - forceCenter.y ) / Math.abs( this.y - forceCenter.y );
      const fSpringX = -k * ( this.x - this.initialX );
      const fSpringY = -k * ( this.y - this.initialY );
      this.vx += fAirX + fSpringX;
      this.vy += fAirY + fSpringY;

      // friction
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }

  return waveInterference.register( 'SoundParticle', SoundParticle );
} );