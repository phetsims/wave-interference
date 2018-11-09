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
  const IntensitySample = require( 'WAVE_INTERFERENCE/common/model/IntensitySample' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PlaySpeedEnum = require( 'WAVE_INTERFERENCE/common/model/PlaySpeedEnum' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const SoundScene = require( 'WAVE_INTERFERENCE/common/model/SoundScene' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const WaterScene = require( 'WAVE_INTERFERENCE/common/model/WaterScene' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // strings
  const cmUnitsString = require( 'string!WAVE_INTERFERENCE/cmUnits' );
  const electricFieldAtCenterString = require( 'string!WAVE_INTERFERENCE/electricFieldAtCenter' );
  const electricFieldString = require( 'string!WAVE_INTERFERENCE/electricField' );
  const femtosecondConversionString = require( 'string!WAVE_INTERFERENCE/femtosecondConversion' );
  const femtosecondsUnitsString = require( 'string!WAVE_INTERFERENCE/femtosecondsUnits' );
  const millisecondConversionString = require( 'string!WAVE_INTERFERENCE/millisecondConversion' );
  const millisecondsUnitsString = require( 'string!WAVE_INTERFERENCE/millisecondsUnits' );
  const nanometersUnitsString = require( 'string!WAVE_INTERFERENCE/nanometersUnits' );
  const positionCMString = require( 'string!WAVE_INTERFERENCE/positionCM' );
  const positionNMString = require( 'string!WAVE_INTERFERENCE/positionNM' );
  const pressureAtCenterString = require( 'string!WAVE_INTERFERENCE/pressureAtCenter' );
  const pressureString = require( 'string!WAVE_INTERFERENCE/pressure' );
  const secondsUnitsString = require( 'string!WAVE_INTERFERENCE/secondsUnits' );
  const waterLevelAtCenterString = require( 'string!WAVE_INTERFERENCE/waterLevelAtCenter' );
  const waterLevelString = require( 'string!WAVE_INTERFERENCE/waterLevel' );

  // Tuned so that iPad2 has enough time to run model computations
  const EVENT_RATE = 20;
  const toFemto = WaveInterferenceUtils.toFemto;

  class WavesScreenModel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {

        // This model supports one or two sources.  If the sources are initially separated, there are two sources
        numberOfSources: 1,

        // Initial amplitude, between 0-10.  We optimize the view for the max, but starting
        // the value at the extreme may prevent the user from exploring the range, so we start closer to the max but not
        // at the max.  I chose 8 so it would match up directly with a tickmark (when it was at 7.5, it covered 2 tickmarks
        // and looked odd)
        initialAmplitude: 8,

        // True if SoundParticles should be created and displayed, and if the user can select to view them
        showSoundParticles: true,

        oscillatorType: 'point' // TODO: docs and enum
      }, options );
      assert && assert( options.numberOfSources === 1 || options.numberOfSources === 2, 'Model only supports 1 or 2 sources' );

      // @public {Property.<ViewType>}
      this.viewTypeProperty = new Property( ViewType.TOP, {
        validValues: ViewType.VALUES
      } );

      // Water scene
      this.waterScene = new WaterScene( {
        oscillatorType: options.oscillatorType,

        // TODO: Should these values be in WaterScene, or here?
        positionUnits: 'cm',
        translatedPositionUnits: cmUnitsString,
        timeUnits: secondsUnitsString,
        timeScaleString: '',

        verticalAxisTitle: waterLevelString,
        graphTitle: waterLevelAtCenterString,
        graphHorizontalAxisLabel: positionCMString,
        waveAreaWidth: 10, // 10 centimeters
        minimumFrequency: 0.25, // cycles per second
        maximumFrequency: 1, // cycles per second
        scaleIndicatorLength: 1, // 1 centimeter
        numberOfSources: options.numberOfSources,
        waveSpeed: 1.85, // in position units / time units, measured empirically as 5.4 seconds to cross the 10cm lattice

        timeScaleFactor: 1, // 1 second in real time = 1 second on the simulation timer

        initialSlitWidth: 2, // cm
        initialSlitSeparation: 3, // cm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: false,
        name: 'water' // TODO: eliminate
      } );

      // Sound scene
      this.soundScene = new SoundScene( options.showSoundParticles, {
        oscillatorType: options.oscillatorType,
        positionUnits: 'cm',
        translatedPositionUnits: cmUnitsString,
        timeUnits: millisecondsUnitsString,
        timeScaleString: millisecondConversionString,

        verticalAxisTitle: pressureString,
        graphTitle: pressureAtCenterString,
        graphHorizontalAxisLabel: positionCMString,
        waveAreaWidth: 500, // in cm

        // See https://pages.mtu.edu/~suits/notefreqs.html
        minimumFrequency: 220 / 1000, // A3 in cycles per ms, wavelength is 156.8cm
        maximumFrequency: 440 / 1000, // A4 in cycles per ms, wavelength is  78.4cm
        scaleIndicatorLength: 50, // cm
        numberOfSources: options.numberOfSources,
        waveSpeed: 34.3, // in cm/ms

        // Determined empirically by setting timeScaleFactor to 1, then checking the displayed wavelength of maximum
        // frequency sound on the lattice and dividing by the desired wavelength
        timeScaleFactor: 90 / 39.2,

        initialSlitWidth: 50, // cm
        initialSlitSeparation: 150, // cm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: true,
        name: 'sound'
      } );

      // Light scene.  TODO: Why is there no subclass for LightScene?
      this.lightScene = new Scene( {
        oscillatorType: options.oscillatorType,
        positionUnits: 'nm',
        translatedPositionUnits: nanometersUnitsString,
        timeUnits: femtosecondsUnitsString,
        timeScaleString: femtosecondConversionString,
        verticalAxisTitle: electricFieldString,
        graphTitle: electricFieldAtCenterString,
        graphHorizontalAxisLabel: positionNMString,
        waveAreaWidth: 5000, // nm
        minimumFrequency: toFemto( VisibleColor.MIN_FREQUENCY ), // in cycles per femtosecond
        maximumFrequency: toFemto( VisibleColor.MAX_FREQUENCY ), // in cycles per femtosecond
        initialFrequency: toFemto( VisibleColor.SPEED_OF_LIGHT / 660E-9 ), // Start with red light because it is a familiar LED color
        scaleIndicatorLength: 500, // nm

        numberOfSources: options.numberOfSources,

        // in nm/fs
        waveSpeed: 299.792458,

        // Determined empirically by setting timeScaleFactor to 1, then checking the displayed wavelength of maximum
        // frequency wave on the lattice and dividing by the desired wavelength
        timeScaleFactor: 1853 / 660,

        initialSlitWidth: 500, // nm
        initialSlitSeparation: 1500, // nm

        initialAmplitude: options.initialAmplitude,
        linkDesiredAmplitudeToAmplitude: true,
        name: 'light' // TODO: eliminate this
      } );

      // @public (read-only) {Scene[]} - the Scene instances as an array
      this.scenes = [ this.waterScene, this.soundScene, this.lightScene ];

      // @public {Property.<PlaySpeedEnum>} - the speed at which the simulation is playing
      this.playSpeedProperty = new Property( PlaySpeedEnum.NORMAL, {
        validValues: PlaySpeedEnum.VALUES
      } );

      const eventTimerModel = {

        // @public
        getPeriodBeforeNextEvent: () => 1 / EVENT_RATE / this.playSpeedProperty.get().scaleFactor
      };

      // @private
      this.eventTimer = new EventTimer( eventTimerModel, timeElapsed =>
        this.advanceTime( 1 / EVENT_RATE, false )
      );

      // @public {Property.<Scene>} - selected scene
      this.sceneProperty = new Property( this.waterScene, {
        validValues: [ this.waterScene, this.soundScene, this.lightScene ]
      } );

      // @public {BooleanProperty} - whether the wave area should be displayed
      this.showWavesProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - whether the wave area graph should be displayed
      this.showGraphProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - whether the screen (on the right of the lattice) should be shown.
      this.showScreenProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - whether the intensity graph (on the right of the lattice) should be shown.
      this.showIntensityGraphProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - whether the model is moving forward in time
      this.isRunningProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - whether the measuring tape has been dragged out of the toolbox into the play area
      this.isMeasuringTapeInPlayAreaProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - true if the timer is running
      this.isTimerRunningProperty = new BooleanProperty( false );

      // @public {NumberProperty} - time elapsed on the timer since it was last restarted
      this.timerElapsedTimeProperty = new NumberProperty( 0, {
        units: 'seconds'
      } );

      // @public {BooleanProperty} - true if the timer has been dragged out of the toolbox into the play area
      this.isTimerInPlayAreaProperty = new BooleanProperty( false );

      // @public
      this.isWaveMeterInPlayAreaProperty = new BooleanProperty( false );

      // @public {Property.<number>} - amount the 3d view is rotated. 0 means top view, 1 means side view.
      const rotationRange = new Range( 0, 1 );
      this.rotationAmountProperty = new NumberProperty( 0, {
        range: rotationRange
      } );

      // @public {DerivedProperty.<boolean>} - true if the system is rotating
      this.isRotatingProperty = new DerivedProperty( [ this.rotationAmountProperty ],
        rotationAmount => rotationAmount !== rotationRange.min && rotationAmount !== rotationRange.max
      );

      // @public {Emitter} - emits once per step
      this.stepEmitter = new Emitter();

      // @private {number} - indicates the time when the pulse began, or 0 if there is no pulse.
      this.pulseStartTime = 0;

      // @public {IntensitySample} reads out the intensity on the right hand side of the lattice
      // TODO: only have this for light scene?
      this.intensitySample = new IntensitySample( this.lightScene.lattice );

      // @public {Property.<Vector2>} - model for the view coordinates of the base of the measuring tape
      // We use view coordinates so that nothing needs to be done when switching scenes and coordinate frames.
      this.measuringTapeBasePositionProperty = new Property( new Vector2( 200, 200 ) );

      // @public {Property.<Vector2>} - model for the view coordinates of the tip of the measuring tape
      this.measuringTapeTipPositionProperty = new Property( new Vector2( 220, 200 ) );

      // @public - Notifies listeners when the model reset is complete
      this.resetEmitter = new Emitter();

      // Reset the stopwatch time when changing scenes.  TODO: make sure this is as desired after https://github.com/phetsims/wave-interference/issues/179
      this.sceneProperty.link( () => this.timerElapsedTimeProperty.reset() );
    }

    /**
     * Clears the wave and the Intensity Sample
     * @public
     */
    clear() {
      this.sceneProperty.value.clear();
      this.intensitySample.clear();
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
      const sign = this.viewTypeProperty.get() === ViewType.TOP ? -1 : +1;
      this.rotationAmountProperty.value = Util.clamp( this.rotationAmountProperty.value + wallDT * sign * 1.4, 0, 1 );

      if ( this.isRunningProperty.get() || manualStep ) {
        const dt = wallDT * this.sceneProperty.value.timeScaleFactor;
        if ( this.isTimerRunningProperty.get() ) {
          this.timerElapsedTimeProperty.set( this.timerElapsedTimeProperty.get() + dt );
        }

        // Notify listeners that a frame has advanced
        this.stepEmitter.emit();
        this.intensitySample.step();
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
      this.viewTypeProperty.reset();
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

      // Signify for listeners that the model reset is complete
      this.resetEmitter.emit();
    }

    /**
     * When using water drops, the slider controls the desired frequency.  The actual frequency on the lattice is not
     * set until the water drop hits.
     * @public
     */
    getWaterFrequencySliderProperty() {
      return this.waterScene.desiredFrequencyProperty;
    }

    static get EVENT_RATE() {
      return EVENT_RATE;
    }
  }

  return waveInterference.register( 'WavesScreenModel', WavesScreenModel );
} );