// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Model for the "Waves" screen and other derivative screens.  This model supports two sources, even though the waves
 * screen only uses one.  The controls are in a metric coordinate frame, and there is a transformation to convert
 * metric coordinates to lattice coordinates.  On the view side there is another transformation to convert lattice or
 * metric coordinates to view coordinates.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import TModel from '../../../../joist/js/TModel.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import merge from '../../../../phet-core/js/merge.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import LightScene from '../../common/model/LightScene.js';
import Scene from '../../common/model/Scene.js';
import SoundScene from '../../common/model/SoundScene.js';
import WaterScene from '../../common/model/WaterScene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../../common/WaveInterferenceUtils.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';

const centimetersUnitsString = WaveInterferenceStrings.centimetersUnits;
const electricFieldAtCenterString = WaveInterferenceStrings.electricFieldAtCenter;
const electricFieldString = WaveInterferenceStrings.electricField;
const femtosecondConversionString = WaveInterferenceStrings.femtosecondConversion;
const femtosecondsUnitsString = WaveInterferenceStrings.femtosecondsUnits;
const lightGeneratorString = WaveInterferenceStrings.lightGenerator;
const millisecondConversionString = WaveInterferenceStrings.millisecondConversion;
const millisecondsUnitsString = WaveInterferenceStrings.millisecondsUnits;
const nanometersUnitsString = WaveInterferenceStrings.nanometersUnits;
const positionCMString = WaveInterferenceStrings.positionCM;
const positionNMString = WaveInterferenceStrings.positionNM;
const pressureAtCenterString = WaveInterferenceStrings.pressureAtCenter;
const pressureString = WaveInterferenceStrings.pressure;
const secondsUnitsString = WaveInterferenceStrings.secondsUnits;
const soundGeneratorString = WaveInterferenceStrings.soundGenerator;
const waterLevelAtCenterString = WaveInterferenceStrings.waterLevelAtCenter;
const waterLevelString = WaveInterferenceStrings.waterLevel;
const waterWaveGeneratorString = WaveInterferenceStrings.waterWaveGenerator;

// This simulation uses EventTimer, which provides exactly the same model behavior on very slow and very fast
// platforms.  Here we define the frequency of events in Hz, which has been tuned so that our slowest platform has
// an acceptable frame rate
const EVENT_RATE = 20 * WaveInterferenceConstants.CALIBRATION_SCALE;
const toFemto = WaveInterferenceUtils.toFemto;

type WavesModelOptions = {
  scenes?: ( 'waterScene' | 'soundScene' | 'lightScene' )[];
};

class WavesModel implements TModel {

  public readonly sceneProperty: Property<Scene>;

  // the Scene instances as an array
  public readonly scenes: Scene[] = [];

  public readonly stopwatch = new Stopwatch( {
    timePropertyOptions: {
      range: new Range( 0, 999.99 )
    }
  } );

  /**
   * @param [options]
   */
  public constructor( options?: WavesModelOptions ) {

    options = merge( {

      // This model supports one or two sources.  If the sources are initially separated, there are two sources
      numberOfSources: 1,

      // Initial amplitude of the oscillator, which is unitless and reflects the amount of disturbance at a specified
      // point in the medium. See WaveInterferenceConstants.AMPLITUDE_RANGE.  We optimize the view for the max, but
      // starting the value at the extreme may prevent the user from exploring the range, so we start closer to the
      // max but not at the max.  I chose 8 so it would match up directly with a tickmark (when it was at 7.5, it
      // covered 2 tickmarks and looked odd)
      initialAmplitude: 8,

      // True if SoundParticles should be created and displayed, and if the user can select to view them
      showSoundParticles: true,

      waveSpatialType: Scene.WaveSpatialType.POINT,

      // Array of scenes to be created
      scenes: [ 'waterScene', 'soundScene', 'lightScene' ]
    }, options );

    assert && assert( WaveInterferenceConstants.AMPLITUDE_RANGE.contains( options.initialAmplitude ),
      `initialAmplitude is out of range: ${options.initialAmplitude}` );

    assert && assert(
      options.numberOfSources === 1 || options.numberOfSources === 2,
      'Model only supports 1 or 2 sources'
    );

    // Instantiate the Scenes.  Scene options are specified here to make it easier to compare options between scenes.
    // Scenes are only created if specified in the options.  For example, Wave Interference creates waterScene,
    // soundScene and lightScene whereas Waves Intro's Water screen only creates the waterScene.  This allows
    // pieces from different scenes to (such as showing a swappable frequency control in the same control panel)
    // but unfortunately leads to a lot of checks like if (model.waterScene){...} etc.  If implemented from scratch,
    // this may have been done differently, but this sim initially developed for Wave Interference only (all scenes)
    // and was later retrofitted to have a subset of scenes.  More discussion on this point appears in https://github.com/phetsims/wave-interference/issues/414#issuecomment-516079304

    // @public (read-only) {WaterScene|null}
    this.waterScene = null;

    // @public (read-only) {SoundScene|null}
    this.soundScene = null;

    // @public (read-only) {LightScene|null}
    this.lightScene = null;

    if ( options.scenes.includes( 'waterScene' ) ) {
      this.waterScene = new WaterScene( {
        waveSpatialType: options.waveSpatialType,

        positionUnits: 'cm',
        translatedPositionUnits: centimetersUnitsString,
        timeUnits: secondsUnitsString,
        timeScaleString: '',

        graphVerticalAxisLabel: waterLevelString,
        graphTitle: waterLevelAtCenterString,
        graphHorizontalAxisLabel: positionCMString,
        waveAreaWidth: 10, // 10 centimeters
        frequencyRange: new Range( 0.25, 1 ), // cycles per second
        scaleIndicatorLength: 1, // 1 centimeter
        numberOfSources: options.numberOfSources,

        // Calibration for water is done by measuring the empirical wave speed, since we want the timeScaleFactor to
        // remain as 1.0
        // in position units/time units, measured empirically as 5.4 seconds to cross the 10cm lattice
        waveSpeed: 1.65,

        timeScaleFactor: 1, // 1 second in real time = 1 second on the simulation timer

        initialSlitWidth: 1.5, // cm
        initialSlitSeparation: 3, // cm

        sourceSeparationRange: new Range( 1, 5 ), // cm
        slitSeparationRange: new Range( 1, 5 ), // cm
        slitWidthRange: new Range( 0.5, 2.5 ), // cm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: false,
        planeWaveGeneratorNodeText: waterWaveGeneratorString
      } );
      this.scenes.push( this.waterScene );
    }

    // @public - Sound scene
    if ( options.scenes.includes( 'soundScene' ) ) {
      this.soundScene = new SoundScene( options.showSoundParticles, {
        waveSpatialType: options.waveSpatialType,
        positionUnits: 'cm',
        translatedPositionUnits: centimetersUnitsString,
        timeUnits: millisecondsUnitsString,
        timeScaleString: millisecondConversionString,

        graphVerticalAxisLabel: pressureString,
        graphTitle: pressureAtCenterString,
        graphHorizontalAxisLabel: positionCMString,
        waveAreaWidth: 500, // in cm

        // See https://pages.mtu.edu/~suits/notefreqs.html
        frequencyRange: new Range(
          // A3 in cycles per ms, wavelength is 156.8cm
          220 / 1000,

          // A4 in cycles per ms, wavelength is  78.4cm
          440 / 1000
        ),
        scaleIndicatorLength: 50, // cm
        numberOfSources: options.numberOfSources,
        waveSpeed: 34.3, // in cm/ms

        // Determined empirically by setting timeScaleFactor to 1, then checking the displayed wavelength of maximum
        // frequency sound on the lattice and dividing by the desired wavelength.  ?log can be useful.  Can check/fine
        // tune by measuring the speed of sound.
        timeScaleFactor: 244.7 / 103.939 * 35.24 / 34.3,

        initialSlitWidth: 90, // cm
        initialSlitSeparation: 200, // cm
        sourceSeparationRange: new Range( 100, 400 ), // cm
        slitWidthRange: new Range( 20, 160 ), // cm
        slitSeparationRange: new Range( 40, 320 ), // cm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: true,
        planeWaveGeneratorNodeText: soundGeneratorString
      } );
      this.scenes.push( this.soundScene );
    }

    // @public - Light scene.
    if ( options.scenes.includes( 'lightScene' ) ) {
      this.lightScene = new LightScene( {
        waveSpatialType: options.waveSpatialType,
        positionUnits: 'nm',
        translatedPositionUnits: nanometersUnitsString,
        timeUnits: femtosecondsUnitsString,
        timeScaleString: femtosecondConversionString,
        graphVerticalAxisLabel: electricFieldString,
        graphTitle: electricFieldAtCenterString,
        graphHorizontalAxisLabel: positionNMString,
        waveAreaWidth: 5000, // nm

        // in cycles per femtosecond
        frequencyRange: new Range( toFemto( VisibleColor.MIN_FREQUENCY ), toFemto( VisibleColor.MAX_FREQUENCY ) ),
        scaleIndicatorLength: 500, // nm

        numberOfSources: options.numberOfSources,

        // in nm/fs
        waveSpeed: 299.792458,

        // Determined empirically by setting timeScaleFactor to 1, then checking the displayed wavelength of maximum
        // frequency wave on the lattice and dividing by the desired wavelength.  Can check by measuring the speed of
        // light
        timeScaleFactor: 1416.5 / 511.034,

        // nm - if this value is too high, the light screen will oversaturate,
        // see https://github.com/phetsims/wave-interference/issues/209
        initialSlitWidth: 500, // nm
        initialSlitSeparation: 1500, // nm
        sourceSeparationRange: new Range( 500, 4000 ), // nm
        slitWidthRange: new Range( 200, 1600 ), // nm
        slitSeparationRange: new Range( 400, 3200 ), // nm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: true,
        planeWaveGeneratorNodeText: lightGeneratorString
      } );
      this.scenes.push( this.lightScene );
    }

    // @public (read-only) {number} - number of sources that can emit
    this.numberOfSources = options.numberOfSources;

    // @public - indicates the user selection for side view or top view
    this.viewpointProperty = new Property( WavesModel.Viewpoint.TOP, {
      validValues: WavesModel.Viewpoint.VALUES
    } );

    // @public - the speed at which the simulation is playing
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL );

    const eventTimerModel = {

      // @public
      getPeriodBeforeNextEvent: () => {
        const scaleFactor = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? 1.0 : 0.5;
        return 1 / EVENT_RATE / scaleFactor;
      }
    };

    // @private - In order to have exactly the same model behavior on very fast and very slow platforms, we use
    // EventTimer, which updates the model at regular intervals, and we can interpolate between states for additional
    // fidelity.
    this.eventTimer = new EventTimer( eventTimerModel, timeElapsed =>
      this.advanceTime( 1 / EVENT_RATE, false )
    );

    this.sceneProperty = new Property( this[ options.scenes[ 0 ] ], {
      validValues: this.scenes
    } );

    // @public - whether the wave area should be displayed
    this.showWavesProperty = new BooleanProperty( true );

    // @public - whether the wave area graph should be displayed
    this.showGraphProperty = new BooleanProperty( false );

    // @public - whether the screen (on the right of the lattice) should be shown.
    this.showScreenProperty = new BooleanProperty( false );

    // @public - whether the intensity graph (on the right of the lattice) should be shown.
    this.showIntensityGraphProperty = new BooleanProperty( false );

    // @public - whether the model is moving forward in time
    this.isRunningProperty = new BooleanProperty( true );

    // @public - whether the measuring tape has been dragged out of the toolbox into the play area
    this.isMeasuringTapeInPlayAreaProperty = new BooleanProperty( false );

    // @public
    this.isWaveMeterInPlayAreaProperty = new BooleanProperty( false );

    const rotationAmountRange = new Range( 0, 1 );

    // @public - Linear interpolation between WavesModel.Viewpoint.TOP (0) and Viewpoint.SIDE (1).  This linear
    // interpolate in the model is mapped through a CUBIC_IN_OUT in the view to obtain the desired look.
    this.rotationAmountProperty = new NumberProperty( 0, {
      range: rotationAmountRange
    } );

    // @public {DerivedProperty.<boolean>} - true if the system is rotating
    this.isRotatingProperty = new DerivedProperty( [ this.rotationAmountProperty ],
      rotationAmount => rotationAmount !== rotationAmountRange.min && rotationAmount !== rotationAmountRange.max
    );

    // @public - emits once per step
    this.stepEmitter = new Emitter();

    // @public - model for the view coordinates of the base of the measuring tape
    // We use view coordinates so that nothing needs to be done when switching scenes and coordinate frames.
    this.measuringTapeBasePositionProperty = new Vector2Property( new Vector2( 200, 200 ) );

    // @public - model for the view coordinates of the tip of the measuring tape
    // This position sets reasonable model defaults for each scene: 1.0cm, 50cm, 500nm
    this.measuringTapeTipPositionProperty = new Vector2Property( new Vector2( 250, 200 ) );

    // @public - Notifies listeners when the model reset is complete
    this.resetEmitter = new Emitter();

    // @public - Notifies when reset in in progress, used to mute sounds while reset is in progress
    this.isResettingProperty = new BooleanProperty( false );

    // Reset the stopwatch time when changing scenes, and pause it.
    this.sceneProperty.link( () => {
      this.stopwatch.isRunningProperty.reset();
      this.stopwatch.isVisibleProperty.reset();
    } );
  }

  /**
   * Clears the wave and the Intensity Sample
   */
  public clear(): void {
    this.sceneProperty.value.clear();
  }

  /**
   * Advance time by the specified amount
   * @param dt - amount of time in seconds to move the model forward
   */
  public step( dt: number ): void {

    // Feed the real time to the eventTimer and it will trigger advanceTime at the appropriate rate
    this.eventTimer.step( dt );
  }

  /**
   * Additionally called from the "step" button
   * @param wallDT - amount of wall time that passed, will be scaled by time scaling value
   * @param manualStep - true if the step button is being pressed
   */
  public advanceTime( wallDT: number, manualStep: boolean ): void {

    // Animate the rotation, if it needs to rotate.  This is not subject to being paused, because we would like
    // students to be able to see the side view, pause it, then switch to the corresponding top view, and vice versa.
    const sign = this.viewpointProperty.get() === WavesModel.Viewpoint.TOP ? -1 : +1;
    this.rotationAmountProperty.value = Utils.clamp( this.rotationAmountProperty.value + wallDT * sign * 1.4, 0, 1 );

    if ( this.isRunningProperty.get() || manualStep ) {
      const dt = wallDT * this.sceneProperty.value.timeScaleFactor;
      this.stopwatch.step( dt );

      // Notify listeners that a frame has advanced
      this.stepEmitter.emit();
      this.sceneProperty.value.lattice.interpolationRatio = this.eventTimer.getRatio();
      this.sceneProperty.value.advanceTime( wallDT, manualStep );
    }
  }

  /**
   * Restores the initial conditions
   */
  public reset(): void {
    this.isResettingProperty.value = true;

    // Reset frequencyProperty first because it changes the time and phase.  This is done by resetting each of the
    // frequencyProperties in the scenes
    this.waterScene && this.waterScene.reset();
    this.soundScene && this.soundScene.reset();
    this.lightScene && this.lightScene.reset();

    this.sceneProperty.reset();
    this.viewpointProperty.reset();
    this.showGraphProperty.reset();
    this.timeSpeedProperty.reset();
    this.isRunningProperty.reset();
    this.showScreenProperty.reset();
    this.rotationAmountProperty.reset();
    this.stopwatch.reset();
    this.showIntensityGraphProperty.reset();
    this.isWaveMeterInPlayAreaProperty.reset();
    this.measuringTapeTipPositionProperty.reset();
    this.measuringTapeBasePositionProperty.reset();
    this.isMeasuringTapeInPlayAreaProperty.reset();

    // Signify to listeners that the model reset is complete
    this.resetEmitter.emit();

    this.isResettingProperty.value = false;
  }

  /**
   * When using water drops, the slider controls the desired frequency.  The actual frequency on the lattice is not
   * set until the water drop hits.
   */
  public getWaterFrequencySliderProperty(): number {
    return this.waterScene.desiredFrequencyProperty;
  }
}

/**
 * @static
 * @public
 */
WavesModel.EVENT_RATE = EVENT_RATE;

/**
 * The wave area can be viewed from the TOP or from the SIDE. The view animates between the selections.
 * @public
 */
WavesModel.Viewpoint = EnumerationDeprecated.byKeys( [ 'TOP', 'SIDE' ] );

waveInterference.register( 'WavesModel', WavesModel );
export default WavesModel;