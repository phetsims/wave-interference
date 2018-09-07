// Copyright 2018, University of Colorado Boulder

/**
 * The model for the Water scene, which adds WaterDrop instances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const arrayRemove = require( 'PHET_CORE/arrayRemove' );
  const Property = require( 'AXON/Property' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const WaterDrop = require( 'WAVE_INTERFERENCE/common/model/WaterDrop' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaterScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      this.desiredFrequencyProperty = new Property( this.initialFrequency );

      // @public (read-only) {WaterDrop[]} drops of water that are falling from the hose to the lattice.
      this.waterDrops = [];
    }

    /**
     * Move forward in time by the specified amount, updating velocity and position of the SoundParticle instances
     * @param {WavesScreenModel} model
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( model, dt ) {

      super.step( model, dt );

      if ( Math.random() < 0.1 ) {
        this.waterDrops.push( new WaterDrop( this.desiredFrequencyProperty.value, model.desiredAmplitudeProperty.value, 300 ) );
      }
      var toRemove = [];
      for ( let waterDrop of this.waterDrops ) {
        waterDrop.y -= 10;
        if ( waterDrop.y < 0 ) {
          toRemove.push( waterDrop );
          model.amplitudeProperty.set( waterDrop.amplitude );
          model.waterScene.frequencyProperty.set( waterDrop.frequency );
          // TODO: phase?
        }
      }
      for ( let element of toRemove ) {
        arrayRemove( this.waterDrops, element );
      }
    }
  }

  return waveInterference.register( 'WaterScene', WaterScene );
} );