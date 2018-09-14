// Copyright 2018, University of Colorado Boulder

/**
 * The model for the Sound scene, which adds SoundParticle instances.  See the following pages for visualizations
 * and physics of wave transmission
 * http://homepage.physics.uiowa.edu/~fskiff/Physics_044/Some%20more%20details%20on%20Sound.pdf
 * https://www.npr.org/2014/04/09/300563606/what-does-sound-look-like
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const SoundParticle = require( 'WAVE_INTERFERENCE/common/model/SoundParticle' );
  const SoundViewType = require( 'WAVE_INTERFERENCE/common/model/SoundViewType' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SoundScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      // @public {Property.<string>} - indicates the selected view for sound
      this.viewSelectionProperty = new Property( SoundViewType.WAVES, {
        validValues: SoundViewType.VALUES
      } );

      // @public (read-only) {SoundParticle[]} particles for the sound scene.
      this.soundParticles = [];

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

    /**
     * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
     * @param {WavesScreenModel} model
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( model, dt ) {
      const lattice = model.lattice;

      super.step( model, dt );

      for ( let soundParticle of this.soundParticles ) {

        // Check the lattice coordinate of the current location of the particle
        const latticeCoordinate = this.modelToLatticeTransform.modelToViewXY( soundParticle.x, soundParticle.y );
        const latticeX = Math.round( latticeCoordinate.x );
        const latticeY = Math.round( latticeCoordinate.y );

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

        const k = 10;
        const fx = gradientX * k;
        const fy = gradientY * k;
        soundParticle.applyForce( fx, fy, dt );
      }
    }
  }

  return waveInterference.register( 'SoundScene', SoundScene );
} );