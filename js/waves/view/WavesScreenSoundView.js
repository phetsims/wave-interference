// Copyright 2019, University of Colorado Boulder

/**
 * Sets up sounds for items on the Waves Screen which are not already associated with pre-existing components.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Property = require( 'AXON/Property' );
  const SineWaveGenerator = require( 'WAVE_INTERFERENCE/waves/view/SineWaveGenerator' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const Utils = require( 'DOT/Utils' ); // eslint-disable-line
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // sounds
  const lightBeamLoopSound = require( 'sound!WAVE_INTERFERENCE/light-beam-loop-v5-eq-out-bass.mp3' );
  const speakerPulseSound = require( 'sound!WAVE_INTERFERENCE/speaker-pulse-v4.mp3' );
  const waterDropSound0 = require( 'sound!WAVE_INTERFERENCE/water-drop-v5.mp3' );
  const waterDropSound1 = require( 'sound!WAVE_INTERFERENCE/water-drop-v5-001.mp3' );
  const waterDropSound2 = require( 'sound!WAVE_INTERFERENCE/water-drop-v5-002.mp3' );
  const waterDropSound3 = require( 'sound!WAVE_INTERFERENCE/water-drop-v5-003.mp3' );

  class WavesScreenSoundView {

    /**
     * @param {WavesModel} model
     * @param {WavesScreenView} view
     * @param {Object} [options]
     * @public
     */
    static init( model, view, options ) {

      // The sound scene generates a sine wave when the "Play Tone" checkbox is checked
      if ( model.soundScene && options.controlPanelOptions.showPlaySoundControl ) {
        const sineWavePlayer = new SineWaveGenerator(
          model.soundScene.frequencyProperty,
          model.soundScene.amplitudeProperty, {
            enableControlProperties: [
              model.soundScene.isSineWavePlayingProperty,
              model.soundScene.button1PressedProperty,
              model.isRunningProperty,
              new DerivedProperty( [ model.isResettingProperty ], isResetting => !isResetting )
            ]
          } );

        // Suppress the tone when another screen is selected
        soundManager.addSoundGenerator( sineWavePlayer, {
          associatedViewNode: view
        } );
        const isSoundSceneProperty = new DerivedProperty( [ model.sceneProperty ], scene => scene === model.soundScene );
        sineWavePlayer.addEnableControlProperty( isSoundSceneProperty );
      }

      if ( model.waterScene ) {
        const waterDropSoundClip0 = new SoundClip( waterDropSound0, { initialOutputLevel: 0.22 } );
        const waterDropSoundClip1 = new SoundClip( waterDropSound1, { initialOutputLevel: 0.22 } );
        const waterDropSoundClip2 = new SoundClip( waterDropSound2, { initialOutputLevel: 0.22 } );
        const waterDropSoundClip3 = new SoundClip( waterDropSound3, { initialOutputLevel: 0.22 } );
        soundManager.addSoundGenerator( waterDropSoundClip0 );
        soundManager.addSoundGenerator( waterDropSoundClip1 );
        soundManager.addSoundGenerator( waterDropSoundClip2 );
        soundManager.addSoundGenerator( waterDropSoundClip3 );
        const soundClips = [
          waterDropSoundClip0,
          waterDropSoundClip1,
          waterDropSoundClip2,
          waterDropSoundClip3
        ];

        // The water drop SoundClip that was most recently played, to avoid repeats
        let lastPlayedWaterDropSoundClip = null;

        // When a water drop is absorbed, play a water drop sound.
        model.waterScene.waterDropAbsorbedEmitter.addListener( waterDrop => {

          // The waterDrop.amplitude indicates the size of the water drop and the strength of the resulting wave.
          // Smaller water drops play with a higher frequency.
          const amplitude = Utils.linear(
            WaveInterferenceConstants.AMPLITUDE_RANGE.min, WaveInterferenceConstants.AMPLITUDE_RANGE.max,
            1.0, 0.5, waterDrop.amplitude
          );

          // Select water drop sounds randomly, but do not let the same sound go twice in a row
          const availableClips = _.without( soundClips, lastPlayedWaterDropSoundClip );
          lastPlayedWaterDropSoundClip = phet.joist.random.sample( availableClips );
          lastPlayedWaterDropSoundClip.setPlaybackRate( amplitude );
          lastPlayedWaterDropSoundClip.play();
        } );
      }

      if ( model.soundScene ) {
        const speakerPulseSoundClip = new SoundClip( speakerPulseSound, {

          // The sound repeats, so the waveform should not be clipped
          trimSilence: false,
          initialOutputLevel: 0
        } );
        soundManager.addSoundGenerator( speakerPulseSoundClip );

        // When the wave generator completes a full cycle (passing from positive to negative), restart the speaker
        // clip at the corresponding volume and frequency.  Note this means if the frequency or volume changes, the
        // user has to wait for the next cycle to hear the change.
        // TODO (for the reviewer): is that last constraint about having to wait for the next cycle to hear change OK?
        let previousOscillatorValue = null;
        Property.multilink( [
          model.soundScene.oscillator1Property,
          model.soundScene.isSineWavePlayingProperty
        ], ( oscillatorValue, isSineWavePlayingProperty ) => {
          if ( previousOscillatorValue >= 0 && oscillatorValue < 0 ) {
            const maxVolume = isSineWavePlayingProperty ? 0.04 : 0.2;
            const amplitude = Utils.linear(
              model.soundScene.amplitudeProperty.range.min, model.soundScene.amplitudeProperty.range.max,
              0.0, maxVolume, model.soundScene.amplitudeProperty.value
            );
            const playbackRate = Utils.linear(
              model.soundScene.frequencyProperty.range.min, model.soundScene.frequencyProperty.range.max,
              1, 1.4, model.soundScene.frequencyProperty.value
            );
            speakerPulseSoundClip.setOutputLevel( amplitude, 0.2 ); // Time constant must work for amplitude changes and ducking
            speakerPulseSoundClip.setPlaybackRate( playbackRate / 2 );
            speakerPulseSoundClip.play();
          }

          previousOscillatorValue = oscillatorValue;
        } );
      }

      if ( model.lightScene ) {

        const lightBeamLoopSoundClip = new SoundClip( lightBeamLoopSound, {
          loop: true
        } );

        // TODO: @jbphet: the following line cuts the audio by about half when used instead of using the multilink
        // TODO: below also note when I added associatedViewNode: view this also cut the volume approximately in half
        // lightBeamLoopSoundClip.addEnableControlProperty( model.lightScene.soundEffectEnabledProperty );
        soundManager.addSoundGenerator( lightBeamLoopSoundClip, {
          associatedViewNode: view
        } );

        const lightAmplitudeProperty = model.lightScene.amplitudeProperty;
        const lightFrequencyProperty = model.lightScene.frequencyProperty;
        Property.multilink( [ lightAmplitudeProperty, lightFrequencyProperty ], ( amplitude, frequency ) => {
          const outputLevel = Utils.linear( lightAmplitudeProperty.range.min, lightAmplitudeProperty.range.max,
            0.0, 0.4, amplitude );
          const playbackRate = Utils.linear( lightFrequencyProperty.range.min, lightFrequencyProperty.range.max,
            1, 1.8, frequency );
          lightBeamLoopSoundClip.setOutputLevel( outputLevel );
          lightBeamLoopSoundClip.setPlaybackRate( playbackRate );
        } );

        Property.multilink( [
          model.lightScene.button1PressedProperty,
          model.isRunningProperty,
          model.lightScene.soundEffectEnabledProperty
        ], ( button1Pressed, isRunning, enabled ) => {
          const shouldPlay = button1Pressed && isRunning && enabled;
          if ( lightBeamLoopSoundClip.isPlaying && !shouldPlay ) {
            lightBeamLoopSoundClip.stop();
          }
          else if ( !lightBeamLoopSoundClip.isPlaying && shouldPlay ) {
            lightBeamLoopSoundClip.play();
          }
        } );
      }
    }
  }

  return waveInterference.register( 'WavesScreenSoundView', WavesScreenSoundView );
} );