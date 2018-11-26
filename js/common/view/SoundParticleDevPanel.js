// Copyright 2018, University of Colorado Boulder

/**
 * When ?dev is provided, shows developer controls for exploring and fine-tuning the sound particle model and other
 * parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const Range = require( 'DOT/Range' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class SoundParticleDevPanel extends Panel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      super( new VBox( {
        spacing: 20,
        children: [

          // TODO: delete or keep?  Fine tuning and discussion in https://github.com/phetsims/wave-interference/issues/142
          // This exists for the lifetime of the sim and doesn't require disposal.
          new NumberControl( 'cutoff',
            WaveInterferenceConstants.CUTOFF,
            new Range( 0, 1 ),
            _.extend( { delta: 0.01, decimalPlaces: 2 }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS )
          ),

          // This exists for the lifetime of the sim and doesn't require disposal.
          new NumberControl( 'randomness',
            WaveInterferenceConstants.SOUND_PARTICLE_RANDOMNESS_PROPERTY,
            new Range( 0, 30 ),
            _.extend( { delta: 0.25, decimalPlaces: 2 }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS )
          ),

          // This exists for the lifetime of the sim and doesn't require disposal.
          new NumberControl( 'ADJUST home force',
            WaveInterferenceConstants.SOUND_PARTICLE_RESTORATION_SCALE,
            new Range( 0.1, 2 ),
            _.extend( { delta: 0.01, decimalPlaces: 2 }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS )
          ),

          // This exists for the lifetime of the sim and doesn't require disposal.
          new NumberControl( 'friction (1=none)',
            WaveInterferenceConstants.SOUND_PARTICLE_FRICTION_SCALE_PROPERTY,
            new Range( 0.7, 1.0 ),
            _.extend( { delta: 0.005, decimalPlaces: 3 }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS )
          ),

          // This exists for the lifetime of the sim and doesn't require disposal.
          new NumberControl( 'ADJUST gradient force',
            WaveInterferenceConstants.SOUND_PARTICLE_GRADIENT_FORCE_SCALE_PROPERTY,
            new Range( 0.1, 2 ),
            _.extend( { delta: 0.01, decimalPlaces: 2 }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS )
          )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'SoundParticleDevPanel', SoundParticleDevPanel );
} );