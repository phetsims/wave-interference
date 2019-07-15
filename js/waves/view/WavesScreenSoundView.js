// Copyright 2019, University of Colorado Boulder

/**
 * Sets up sounds for the Waves Screen which are not associated with pre-existing components.
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
     */
    constructor( model, view, options ) {

      // Only wire up for the sound scene
      if ( options.controlPanelOptions.showPlaySoundControl ) {
        const sineWavePlayer = new SineWaveGenerator( model.soundScene.frequencyProperty, model.soundScene.amplitudeProperty, {
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

      if ( WaveInterferenceQueryParameters.fullSonification ) {

        const waterDropSoundClip0 = new SoundClip( waterDropSound0 );
        const waterDropSoundClip1 = new SoundClip( waterDropSound1 );
        const waterDropSoundClip2 = new SoundClip( waterDropSound2 );
        const waterDropSoundClip3 = new SoundClip( waterDropSound3 );
        soundManager.addSoundGenerator( waterDropSoundClip0 );
        soundManager.addSoundGenerator( waterDropSoundClip1 );
        soundManager.addSoundGenerator( waterDropSoundClip2 );
        soundManager.addSoundGenerator( waterDropSoundClip3 );
        let selectedClip = null;
        const soundClips = [
          waterDropSoundClip0,
          waterDropSoundClip1,
          waterDropSoundClip2,
          waterDropSoundClip3
        ];
        model.waterScene.waterDropAbsorbedEmitter.addListener( waterDrop => {
          const amp = Util.linear( WaveInterferenceConstants.AMPLITUDE_RANGE.min, WaveInterferenceConstants.AMPLITUDE_RANGE.max,
            1.0, 0.5, waterDrop.amplitude );

          // Select water drop sounds randomly, but do not let the same sound go twice in a row
          selectedClip = phet.joist.random.sample( _.without( soundClips, selectedClip ) );
          selectedClip.setPlaybackRate( amp );
          selectedClip.play();
        } );

        soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.isResettingProperty, {
          initialOutputLevel: 0.7
        } ) );

        const speakerPulseSoundClip = new SoundClip( speakerPulseSound, {
          trimSilence: false
        } );
        soundManager.addSoundGenerator( speakerPulseSoundClip );
        model.soundScene.oscillator1Property.link( ( value, previousValue ) => {
          if ( previousValue >= 0 && value < 0 ) {

            const amplitude = Util.linear( model.soundScene.amplitudeProperty.range.min, model.soundScene.amplitudeProperty.range.max,
              0.0, 0.4, model.soundScene.amplitudeProperty.value );
            const playbackRate = Util.linear( model.soundScene.frequencyProperty.range.min, model.soundScene.frequencyProperty.range.max,
              1, 1.4, model.soundScene.frequencyProperty.value );
            speakerPulseSoundClip.setOutputLevel( amplitude, 0.5 );
            speakerPulseSoundClip.setPlaybackRate( playbackRate / 2 );
            speakerPulseSoundClip.play();
          }
        } );

        const lightBeamLoopSoundClip = new SoundClip( lightBeamLoopSound, {
          loop: true
        } );
        soundManager.addSoundGenerator( lightBeamLoopSoundClip );

        const lightAmplitudeProperty = model.lightScene.amplitudeProperty;
        const lightFrequencyProperty = model.lightScene.frequencyProperty;
        Property.multilink( [ lightAmplitudeProperty, lightFrequencyProperty ], ( amplitude, frequency ) => {
          const outputLevel = Util.linear( lightAmplitudeProperty.range.min, lightAmplitudeProperty.range.max,
            0.0, 0.4, amplitude );
          const playbackRate = Util.linear( lightFrequencyProperty.range.min, lightFrequencyProperty.range.max,
            1, 1.8, frequency );
          lightBeamLoopSoundClip.setOutputLevel( outputLevel );
          lightBeamLoopSoundClip.setPlaybackRate( playbackRate );
        } );

        // TODO: starting when the model is unpaused doesn't match the phase
        Property.multilink( [ model.lightScene.button1PressedProperty, model.isRunningProperty ], ( button1Pressed, isRunning ) => {
          const shouldPlay = button1Pressed && isRunning;
          if ( lightBeamLoopSoundClip.isPlaying && !shouldPlay ) {
            lightBeamLoopSoundClip.stop();
          }
          else if ( !lightBeamLoopSoundClip.isPlaying && shouldPlay ) {
            lightBeamLoopSoundClip.play();
          }
        } );
      }
    }

    // TODO: odd workaround for not using statics
    start() {

    }
  }

  return waveInterference.register( 'WavesScreenSoundView', WavesScreenSoundView );
} );