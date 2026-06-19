// Copyright 2019-2026, University of Colorado Boulder

/**
 * Sets up sounds for items on the Waves Screen which are not already associated with pre-existing components.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { linear } from '../../../../dot/js/util/linear.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import WaveGenerator from '../../../../tambo/js/sound-generators/WaveGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import lightBeamLoopV5EqOutBass_mp3 from '../../../sounds/lightBeamLoopV5EqOutBass_mp3.js';
import speakerPulseV4_mp3 from '../../../sounds/speakerPulseV4_mp3.js';
import waterDropV5_001_mp3 from '../../../sounds/waterDropV5_001_mp3.js';
import waterDropV5_002_mp3 from '../../../sounds/waterDropV5_002_mp3.js';
import waterDropV5_003_mp3 from '../../../sounds/waterDropV5_003_mp3.js';
import waterDropV5_mp3 from '../../../sounds/waterDropV5_mp3.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WavesModel from '../model/WavesModel.js';
import type WavesScreenView from './WavesScreenView.js';
import { WavesScreenViewOptions } from './WavesScreenView.js';

// sounds
const waterDropSounds = [ waterDropV5_mp3, waterDropV5_001_mp3, waterDropV5_002_mp3, waterDropV5_003_mp3 ];

class WavesScreenSoundView {

  public constructor( model: WavesModel, view: WavesScreenView, options: WavesScreenViewOptions ) {

    // The sound scene generates a sine wave when the "Play Tone" checkbox is checked
    if ( model.soundScene && options.controlPanelOptions && options.controlPanelOptions.showPlaySoundControl ) {
      const sineWavePlayer = new WaveGenerator(
        model.soundScene.frequencyProperty,
        model.soundScene.amplitudeProperty, {
          enabledProperty: DerivedProperty.and( [
            model.soundScene.isTonePlayingProperty,
            model.soundScene.button1PressedProperty,
            model.isRunningProperty,
            DerivedProperty.not( model.isResettingProperty )
          ] ),

          // Suppress the tone when another screen is selected
          associatedViewNode: view
        } );

      soundManager.addSoundGenerator( sineWavePlayer );
    }

    if ( model.waterScene ) {
      const waterDropOptions = { initialOutputLevel: 1.5 };

      const soundClips = waterDropSounds.map( sound => new SoundClip( sound, waterDropOptions ) );
      soundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

      // The water drop SoundClip that was most recently played, to avoid repeats
      let lastPlayedWaterDropSoundClip: SoundClip | null = null;

      // When a water drop is absorbed, play a water drop sound.
      model.waterScene.waterDropAbsorbedEmitter.addListener( waterDrop => {

        // The waterDrop.amplitude indicates the size of the water drop and the strength of the resulting wave.
        // Smaller water drops play with a higher frequency.
        const amplitude = linear(
          WaveInterferenceConstants.AMPLITUDE_RANGE.min, WaveInterferenceConstants.AMPLITUDE_RANGE.max,
          1.0, 0.5, waterDrop.amplitude
        );

        // Select water drop sounds randomly, but do not let the same sound go twice in a row
        const availableClips = _.without( soundClips, lastPlayedWaterDropSoundClip );
        lastPlayedWaterDropSoundClip = dotRandom.sample( availableClips );
        lastPlayedWaterDropSoundClip!.setPlaybackRate( amplitude );

        // The wave meter node takes precedence over the water drop sounds
        lastPlayedWaterDropSoundClip!.setOutputLevel( view.waveMeterNode.duckingProperty.value * 0.9, 0 );

        lastPlayedWaterDropSoundClip!.play();
      } );
    }

    if ( model.soundScene ) {

      // Capture as a non-null local so the closures below do not see the widened nullable type.
      const soundScene = model.soundScene;
      const speakerMembraneSoundClip = new SoundClip( speakerPulseV4_mp3, {

        // The sound repeats, so the waveform should not be trimmed
        trimSilence: false,
        initialOutputLevel: 0 // The speaker pulse plays when the speaker membrane oscillates.  The outputLevel is set below.
      } );
      soundManager.addSoundGenerator( speakerMembraneSoundClip );

      // When the wave generator completes a full cycle (passing from positive to negative), restart the speaker
      // clip at the corresponding volume and frequency.  Note this means if the frequency or volume changes, the
      // user has to wait for the next cycle to hear the change.
      //
      // The pulse is gated by an "armed" flag rather than a simple previous-vs-current edge test. The membrane must
      // first rise clearly into the positive half of the cycle to arm the detector; only then does a downward crossing
      // through zero fire the pulse, which immediately disarms until the next positive excursion. This guarantees the
      // designed behavior that pausing and resuming the membrane stays silent until the next clean positive-to-negative
      // crossing, no matter where the membrane was paused (a frozen mid-cycle value can no longer determine the next
      // pulse). It begins armed so the membrane's first downward motion from rest still produces a pulse.
      let armed = true;
      Multilink.multilink( [
        soundScene.oscillator1Property,
        soundScene.isTonePlayingProperty,
        view.waveMeterNode.duckingProperty,
        model.isRunningProperty
      ], ( oscillatorValue: number, isTonePlaying, ducking: number, isRunning ) => {

        const maxVolume = isTonePlaying ? 0 : 0.3;
        const outputLevel = linear(
          // The tone takes precedence over the membrane sound, another level of ducking
          soundScene.amplitudeProperty.range.min, soundScene.amplitudeProperty.range.max,
          0.0, maxVolume, soundScene.amplitudeProperty.value
        );
        const playbackRate = linear(
          soundScene.frequencyProperty.range.min, soundScene.frequencyProperty.range.max,
          1, 1.4, soundScene.frequencyProperty.value
        );

        // Wave meter node takes precedence over the sound speaker membrane sound
        speakerMembraneSoundClip.setOutputLevel( outputLevel * ducking, 0.2 ); // Time constant must work for amplitude changes and ducking
        speakerMembraneSoundClip.setPlaybackRate( playbackRate / 2 );

        // Sometimes a cycle ends at 2.0698762975327177e-13, and sometimes a cycle ends at -6.58607807786067e-14
        // To tolerate both kinds of stopping, we detect a cycle a little below zero, and arm symmetrically above zero.
        const TRIGGER = -1E-6;

        // Re-arm once the membrane is clearly in the positive half of the cycle.
        if ( oscillatorValue > -TRIGGER ) {
          armed = true;
        }

        // Fire once per clean positive-to-negative crossing, then disarm until the next positive excursion.
        if ( armed && oscillatorValue < TRIGGER ) {
          speakerMembraneSoundClip.play();
          armed = false;
        }

        if ( oscillatorValue === 0 || !isRunning ) {
          speakerMembraneSoundClip.stop();
        }
      } );
    }

    if ( model.lightScene ) {

      const lightBeamLoopSoundClip = new SoundClip( lightBeamLoopV5EqOutBass_mp3, {
        loop: true,

        // Suppress the sound when another screen is selected
        associatedViewNode: view
      } );

      soundManager.addSoundGenerator( lightBeamLoopSoundClip );

      const lightAmplitudeProperty = model.lightScene.amplitudeProperty;
      const lightFrequencyProperty = model.lightScene.frequencyProperty;
      Multilink.multilink( [ lightAmplitudeProperty, lightFrequencyProperty, view.waveMeterNode.duckingProperty ], ( amplitude: number, frequency: number, ducking: number ) => {

        // Sound for "Sound Effect" on the light scene.
        const outputLevel = linear( lightAmplitudeProperty.range.min, lightAmplitudeProperty.range.max,
          0.0, 0.67, amplitude );
        const playbackRate = linear( lightFrequencyProperty.range.min, lightFrequencyProperty.range.max,
          1, 1.8, frequency );

        // Wave meter node takes precedence over the light beam sound effect
        lightBeamLoopSoundClip.setOutputLevel( outputLevel * ducking );
        lightBeamLoopSoundClip.setPlaybackRate( playbackRate );
      } );

      Multilink.multilink( [
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

export default WavesScreenSoundView;
