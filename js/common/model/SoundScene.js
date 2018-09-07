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

        // feel a force toward each lattice value in a local neighborhood
        let sumFx = 0;
        let sumFy = 0;
        const SEARCH_RADIUS = 3;
        const CLAMPED_WAVE_VALUE = 1;

        for ( let i = -SEARCH_RADIUS; i <= SEARCH_RADIUS; i++ ) {
          for ( let k = -SEARCH_RADIUS; k <= SEARCH_RADIUS; k++ ) {
            const neighborI = Math.round( latticeCoordinate.x ) + i;
            const neighborJ = Math.round( latticeCoordinate.y ) + k;
            if ( lattice.contains( neighborI, neighborJ ) ) {
              let waveValue = lattice.getCurrentValue( neighborI, neighborJ );
              if ( waveValue > CLAMPED_WAVE_VALUE ) {
                waveValue = CLAMPED_WAVE_VALUE;
              }
              else if ( waveValue < -CLAMPED_WAVE_VALUE ) {
                waveValue = -CLAMPED_WAVE_VALUE;
              }
              const springConstant = waveValue / SEARCH_RADIUS / SEARCH_RADIUS * 2.8; // Tuned manually
              const forceCenter = this.modelToLatticeTransform.viewToModelXY( neighborI, neighborJ );

              // Normalize out the distance so that further away points don't contribute more just from being further away
              const fAirX = -springConstant * ( soundParticle.x - forceCenter.x ) / Math.abs( soundParticle.x - forceCenter.x );
              const fAirY = -springConstant * ( soundParticle.y - forceCenter.y ) / Math.abs( soundParticle.y - forceCenter.y );
              sumFx += fAirX;
              sumFy += fAirY;
            }
          }
        }
        soundParticle.applyForce( sumFx, sumFy, dt );
      }
    }
  }

  return waveInterference.register( 'SoundScene', SoundScene );
} );