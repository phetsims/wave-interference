// Copyright 2018, University of Colorado Boulder

/**
 * The model for the Light scene, which adds the intensity sampling for the screen at the right hand side.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const IntensitySample = require( 'WAVE_INTERFERENCE/common/model/IntensitySample' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class LightScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      //REVIEW (read-only) ?
      //REVIEW* The reference is read only, but clients can call mutators on it.  So how should it be marked?
      //REVIEW With the exception of Property, I believe the PhET convention is that 'read-only' applies to assignment, not mutation. I added doc.
      //REVIEW* Looks good, can this thread be removed?
      // @public (read-only) reads out the intensity on the right hand side of the lattice
      // While this is annotated as 'read-only' for assignment, it can be mutated by clients.
      this.intensitySample = new IntensitySample( this.lattice );
    }

    /**
     * Clears the scene.
     * @public
     * @override
     */
    clear() {
      super.clear();

      // Permit calls to clear before subclass is initialized
      this.intensitySample && this.intensitySample.clear();
    }

    /**
     * @param wallDT
     * @param manualStep
     * @public
     * @override
     */
    advanceTime( wallDT, manualStep ) {
      super.advanceTime( wallDT, manualStep );
      this.intensitySample.step();
    }
  }

  return waveInterference.register( 'LightScene', LightScene );
} );