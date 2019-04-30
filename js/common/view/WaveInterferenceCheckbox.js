// Copyright 2019, University of Colorado Boulder

/**
 * A Checkbox customized for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );

  // sounds
  const checkboxCheckedSound = require( 'sound!TAMBO/check-box-checked.mp3' );
  const checkboxUncheckedSound = require( 'sound!TAMBO/check-box-unchecked.mp3' );

  class WaveInterferenceCheckbox extends Checkbox {

    /**
     * @param {Node} content
     * @param {Property.<boolean>} property
     * @param {Object} [options]
     */
    constructor( content, property, options ) {
      options = _.extend( { boxWidth: 14, supportsSound: false }, options );
      super( content, property, options );

      if ( options.audioEnabled && WaveInterferenceQueryParameters.fullSonification ) {
        const uncheckedClip = new SoundClip( checkboxUncheckedSound );
        soundManager.addSoundGenerator( uncheckedClip );
        const checkedClip = new SoundClip( checkboxCheckedSound );
        soundManager.addSoundGenerator( checkedClip );

        property.lazyLink( value => {
          if ( value ) {
            checkedClip.play();
          }
          else {
            uncheckedClip.play();
          }
        } );
      }
    }
  }

  return waveInterference.register( 'WaveInterferenceCheckbox', WaveInterferenceCheckbox );
} );