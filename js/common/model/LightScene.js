// Copyright 2018, University of Colorado Boulder

/**
 * The model for the Light scene, which adds the intensity sampling for the screen at the right hand side.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const IntensitySample = require( 'WAVE_INTERFERENCE/common/model/IntensitySample' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );

  class LightScene extends Scene {

    /**
     * @param {Object} config - see Scene for required properties
     */
    constructor( config ) {
      super( config );

      // @public (read-only) reads out the intensity on the right hand side of the lattice
      // While this is annotated as 'read-only' for assignment, it can be mutated by clients.
      this.intensitySample = new IntensitySample( this.lattice );

      // @public
      this.soundEffectEnabledProperty = new BooleanProperty( WaveInterferenceQueryParameters.lightSonification );
    }

    /**
     * The wave area resets when the wavelength changes in the light scene
     * @protected
     */
    handlePhaseChanged() {
      this.clear();
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