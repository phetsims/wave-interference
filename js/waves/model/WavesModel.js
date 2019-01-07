// Copyright 2018, University of Colorado Boulder

/**
 * Model for the "Waves" screen and other derivative screens.  This model supports two sources, even though the waves
 * screen only uses one.  The controls are in a metric coordinate frame, and there is a transformation to convert
 * metric coordinates to lattice coordinates.  On the view side there is another transformation to convert lattice or
 * metric coordinates to view coordinates.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const EventTimer = require( 'PHET_CORE/EventTimer' );
  const LightScene = require( 'WAVE_INTERFERENCE/common/model/LightScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const SoundScene = require( 'WAVE_INTERFERENCE/common/model/SoundScene' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const ViewpointEnum = require( 'WAVE_INTERFERENCE/common/model/ViewpointEnum' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const WaterScene = require( 'WAVE_INTERFERENCE/common/model/WaterScene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );
  const WaveSpatialTypeEnum = require( 'WAVE_INTERFERENCE/common/model/WaveSpatialTypeEnum' );

  // strings
  const centimetersUnitsString = require( 'string!WAVE_INTERFERENCE/centimetersUnits' );
  const electricFieldAtCenterString = require( 'string!WAVE_INTERFERENCE/electricFieldAtCenter' );
  const electricFieldString = require( 'string!WAVE_INTERFERENCE/electricField' );
  const femtosecondConversionString = require( 'string!WAVE_INTERFERENCE/femtosecondConversion' );
  const femtosecondsUnitsString = require( 'string!WAVE_INTERFERENCE/femtosecondsUnits' );
  const lightGeneratorString = require( 'string!WAVE_INTERFERENCE/lightGenerator' );
  const millisecondConversionString = require( 'string!WAVE_INTERFERENCE/millisecondConversion' );
  const millisecondsUnitsString = require( 'string!WAVE_INTERFERENCE/millisecondsUnits' );
  const nanometersUnitsString = require( 'string!WAVE_INTERFERENCE/nanometersUnits' );
  const positionCMString = require( 'string!WAVE_INTERFERENCE/positionCM' );
  const positionNMString = require( 'string!WAVE_INTERFERENCE/positionNM' );
  const pressureAtCenterString = require( 'string!WAVE_INTERFERENCE/pressureAtCenter' );
  const pressureString = require( 'string!WAVE_INTERFERENCE/pressure' );
  const secondsUnitsString = require( 'string!WAVE_INTERFERENCE/secondsUnits' );
  const soundGeneratorString = require( 'string!WAVE_INTERFERENCE/soundGenerator' );
  const waterLevelAtCenterString = require( 'string!WAVE_INTERFERENCE/waterLevelAtCenter' );
  const waterLevelString = require( 'string!WAVE_INTERFERENCE/waterLevel' );
  const waterWaveGeneratorString = require( 'string!WAVE_INTERFERENCE/waterWaveGenerator' );

  // This simulation uses EventTimer, which provides exactly the same model behavior on very slow and very fast
  // platforms.  Here we define the frequency of events in Hz, which has been tuned so that iPad2 has enough time to run
  // model computations.
  const EVENT_RATE = 20;
  const toFemto = WaveInterferenceUtils.toFemto;

  class WavesModel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {

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

        waveSpatialType: WaveSpatialTypeEnum.POINT
      }, options );

      assert && assert( WaveInterferenceConstants.AMPLITUDE_RANGE.contains( options.initialAmplitude ),
        'initialAmplitude is out of range: ' + options.initialAmplitude );

      assert && assert(
        options.numberOfSources === 1 || options.numberOfSources === 2,
        'Model only supports 1 or 2 sources'
      );

      // Instantiate the Scenes.  Parameters are declared here to make it easier to compare options
      // and see them in the same file.

      // @public - Water scene
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
        waveSpeed: 1.85, // in position units/time units, measured empirically as 5.4 seconds to cross the 10cm lattice

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

      // @public - Sound scene
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
        // frequency sound on the lattice and dividing by the desired wavelength
        timeScaleFactor: 90 / 39.2,

        initialSlitWidth: 90, // cm
        initialSlitSeparation: 200, // cm
        sourceSeparationRange: new Range( 100, 400 ), // cm
        slitWidthRange: new Range( 20, 160 ), // cm
        slitSeparationRange: new Range( 40, 320 ), // cm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: true,
        planeWaveGeneratorNodeText: soundGeneratorString
      } );

      // @public - Light scene.
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
        // frequency wave on the lattice and dividing by the desired wavelength
        timeScaleFactor: 1853 / 660,

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

      // @public (read-only) {Scene[]} - the Scene instances as an array
      this.scenes = [ this.waterScene, this.soundScene, this.lightScene ];

      // @public - indicates the user selection for side view or top view
      this.viewpointProperty = new Property( ViewpointEnum.TOP, {
        validValues: ViewpointEnum.VALUES
      } );

      // @public - the speed at which the simulation is playing
      this.playSpeedProperty = new Property( PlaySpeedEnum.NORMAL, {
        validValues: PlaySpeedEnum.VALUES
      } );

      const eventTimerModel = {

        // @public
        getPeriodBeforeNextEvent: () => {
          const scaleFactor = this.playSpeedProperty.value === PlaySpeedEnum.NORMAL ? 1.0 : 0.5;
          return 1 / EVENT_RATE / scaleFactor;
        }
      };

      // @private - In order to have exactly the same model behavior on very fast and very slow platforms, we use
      // EventTimer, which updates the model at regular intervals, and we can interpolate between states for additional
      // fidelity.
      this.eventTimer = new EventTimer( eventTimerModel, timeElapsed =>
        this.advanceTime( 1 / EVENT_RATE, false )
      );

      // @public {Property.<Scene>} - selected scene
      this.sceneProperty = new Property( this.waterScene, {
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

      // @public - true if the timer is running
      this.isTimerRunningProperty = new BooleanProperty( false );

      // @public - time elapsed on the timer since it was last restarted
      this.timerElapsedTimeProperty = new NumberProperty( 0, {
        units: 'seconds'
      } );

      // @public - true if the timer has been dragged out of the toolbox into the play area
      this.isTimerInPlayAreaProperty = new BooleanProperty( false );

      // @public
      this.isWaveMeterInPlayAreaProperty = new BooleanProperty( false );

      const rotationAmountRange = new Range( 0, 1 );

      // @public - Linear interpolation between ViewpointEnum.TOP (0) and ViewpointEnum.SIDE (1).  This linear
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
      this.measuringTapeBasePositionProperty = new Property( new Vector2( 200, 200 ), {
        valueType: Vector2
      } );

      // @public - model for the view coordinates of the tip of the measuring tape
      // This position sets reasonable model defaults for each scene: 1.0cm, 50cm, 500nm
      this.measuringTapeTipPositionProperty = new Property( new Vector2( 250, 200 ), {
        valueType: Vector2
      } );

      // @public - Notifies listeners when the model reset is complete
      this.resetEmitter = new Emitter();

      // Reset the stopwatch time when changing scenes, and pause it.
      this.sceneProperty.link( () => {
        this.isTimerRunningProperty.reset();
        this.timerElapsedTimeProperty.reset();
      } );
    }

    /**
     * Clears the wave and the Intensity Sample
     * @public
     */
    clear() {
      this.sceneProperty.value.clear();
    }

    /**
     * Advance time by the specified amount
     * @param {number} dt - amount of time in seconds to move the model forward
     * @public
     */
    step( dt ) {

      // Feed the real time to the eventTimer and it will trigger advanceTime at the appropriate rate
      this.eventTimer.step( dt );
    }

    /**
     * Additionally called from the "step" button
     * @param {number} wallDT - amount of wall time that passed, will be scaled by time scaling value
     * @param {boolean} manualStep - true if the step button is being pressed
     * @public
     */
    advanceTime( wallDT, manualStep ) {

      // Animate the rotation, if it needs to rotate.  This is not subject to being paused, because we would like
      // students to be able to see the side view, pause it, then switch to the corresponding top view, and vice versa.
      const sign = this.viewpointProperty.get() === ViewpointEnum.TOP ? -1 : +1;
      this.rotationAmountProperty.value = Util.clamp( this.rotationAmountProperty.value + wallDT * sign * 1.4, 0, 1 );

      if ( this.isRunningProperty.get() || manualStep ) {
        const dt = wallDT * this.sceneProperty.value.timeScaleFactor;
        if ( this.isTimerRunningProperty.get() ) {
          this.timerElapsedTimeProperty.set( this.timerElapsedTimeProperty.get() + dt );
        }

        // Notify listeners that a frame has advanced
        this.stepEmitter.emit();
        this.sceneProperty.value.lattice.interpolationRatio = this.eventTimer.getRatio();
        this.sceneProperty.value.advanceTime( wallDT, manualStep );
      }
    }

    /**
     * Restores the initial conditions
     * @public
     */
    reset() {

      // Reset frequencyProperty first because it changes the time and phase.  This is done by resetting each of the
      // frequencyProperties in the scenes
      this.waterScene.reset();
      this.soundScene.reset();
      this.lightScene.reset();

      this.sceneProperty.reset();
      this.viewpointProperty.reset();
      this.showGraphProperty.reset();
      this.playSpeedProperty.reset();
      this.isRunningProperty.reset();
      this.showScreenProperty.reset();
      this.rotationAmountProperty.reset();
      this.timerElapsedTimeProperty.reset();
      this.isTimerInPlayAreaProperty.reset();
      this.showIntensityGraphProperty.reset();
      this.isWaveMeterInPlayAreaProperty.reset();
      this.measuringTapeTipPositionProperty.reset();
      this.measuringTapeBasePositionProperty.reset();
      this.isMeasuringTapeInPlayAreaProperty.reset();

      // Signify to listeners that the model reset is complete
      this.resetEmitter.emit();
    }

    /**
     * When using water drops, the slider controls the desired frequency.  The actual frequency on the lattice is not
     * set until the water drop hits.
     * @returns {number}
     * @public
     */
    getWaterFrequencySliderProperty() {
      return this.waterScene.desiredFrequencyProperty;
    }
  }

  /**
   * @static
   * @public
   */
  WavesModel.EVENT_RATE = EVENT_RATE;

  return waveInterference.register( 'WavesModel', WavesModel );
} );