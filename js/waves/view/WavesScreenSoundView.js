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
  const ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  const SineWaveGenerator = require( 'WAVE_INTERFERENCE/waves/view/SineWaveGenerator' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const Util = require( 'DOT/Util' ); // eslint-disable-line
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );

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
              model.soundScene.isSoundPlayingProperty,
              model.soundScene.button1PressedProperty,
              model.isRunningProperty
            ]
          } );

        // Suppress the tone when another screen is selected
        soundManager.addSoundGenerator( sineWavePlayer, {
          associatedViewNode: view
        } );
        const isSoundSceneProperty = new DerivedProperty( [ model.sceneProperty ], scene => scene === model.soundScene );
        sineWavePlayer.addEnableControlProperty( isSoundSceneProperty );
      }

      // Additional sounds which are enabled in ?fullSonification.  Note once we publish Wave Interference and Waves
      // Intro with just the sine wave (above), we plan to republish the entire sim with a11y and full sonification.
      // At that point, the ?fullSonification query parameter will be removed.
      // TODO: Remove this once we publish with full sonification
      if ( WaveInterferenceQueryParameters.fullSonification ) {
        soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.isResettingProperty, {
          initialOutputLevel: 0.7
        } ) );
        if ( model.waterScene ) {
          const waterDropSoundClip0 = new SoundClip( waterDropSound0 );
          const waterDropSoundClip1 = new SoundClip( waterDropSound1 );
          const waterDropSoundClip2 = new SoundClip( waterDropSound2 );
          const waterDropSoundClip3 = new SoundClip( waterDropSound3 );
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
            const amplitude = Util.linear(
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
            trimSilence: false
          } );
          soundManager.addSoundGenerator( speakerPulseSoundClip );

          // When the wave generator completes a full cycle (passing from positive to negative), restart the speaker
          // clip at the corresponding volume and frequency.  Note this means if the frequency or volume changes, the
          // user has to wait for the next cycle to hear the change.
          // TODO (for the reviewer): is that last constraint about having to wait for the next cycle to hear change OK?
          model.soundScene.oscillator1Property.link( ( value, previousValue ) => {
            if ( previousValue >= 0 && value < 0 ) {
              const amplitude = Util.linear(
                model.soundScene.amplitudeProperty.range.min, model.soundScene.amplitudeProperty.range.max,
                0.0, 0.4, model.soundScene.amplitudeProperty.value
              );
              const playbackRate = Util.linear(
                model.soundScene.frequencyProperty.range.min, model.soundScene.frequencyProperty.range.max,
                1, 1.4, model.soundScene.frequencyProperty.value
              );
              speakerPulseSoundClip.setOutputLevel( amplitude, 0.5 );
              speakerPulseSoundClip.setPlaybackRate( playbackRate / 2 );
              speakerPulseSoundClip.play();
            }
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
            const outputLevel = Util.linear( lightAmplitudeProperty.range.min, lightAmplitudeProperty.range.max,
              0.0, 0.8, amplitude );
            const playbackRate = Util.linear( lightFrequencyProperty.range.min, lightFrequencyProperty.range.max,
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
  }

  return waveInterference.register( 'WavesScreenSoundView', WavesScreenSoundView );
} );