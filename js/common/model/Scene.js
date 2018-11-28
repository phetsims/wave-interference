// Copyright 2018, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types, coordinate frames, relative scale, etc.  For a description of
 * which features are independent or shared across scenes, please see
 * https://github.com/phetsims/wave-interference/issues/179#issuecomment-437176489
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Lattice = require( 'WAVE_INTERFERENCE/common/model/Lattice' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'DOT/Rectangle' );
  const SceneType = require( 'WAVE_INTERFERENCE/common/model/SceneType' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Vector2 = require( 'DOT/Vector2' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveSpatialType = require( 'WAVE_INTERFERENCE/common/model/WaveSpatialType' );
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  // strings
  const distanceUnitsString = require( 'string!WAVE_INTERFERENCE/distanceUnits' );
  const timeUnitsString = require( 'string!WAVE_INTERFERENCE/timeUnits' );

  // constants
  const PLANE_WAVE_MAGNITUDE = 0.21;

  class Scene {

    /**
     * @param {Object} config - see below for required properties
     */
    constructor( config ) {

      // @public {WaveSpatialType}
      this.waveSpatialType = config.waveSpatialType;

      // @public {Lattice} the grid that contains the wave values
      this.lattice = new Lattice(
        WaveInterferenceConstants.LATTICE_DIMENSION,
        WaveInterferenceConstants.LATTICE_DIMENSION,
        WaveInterferenceConstants.LATTICE_PADDING,
        WaveInterferenceConstants.LATTICE_PADDING
      );

      // @public {number} - elapsed time in seconds
      this.timeProperty = new NumberProperty( 0 );

      // @public {number} phase of the emitter
      this.phase = 0;

      // @private {number} - indicates the time when the pulse began, or 0 if there is no pulse.
      this.pulseStartTime = 0;

      // @public {Property.<Boolean>} - whether the button for the first source is pressed.  This is also used for the
      // slits screen plane wave source.
      this.button1PressedProperty = new BooleanProperty( false );

      // @public {Property.<Boolean>} - whether the button for the second source is pressed
      this.button2PressedProperty = new BooleanProperty( false );

      // @public (read-only) {string} - units for this scene
      this.translatedPositionUnits = config.translatedPositionUnits;

      // @public (read-only) {number} - width of the visible part of the lattice in the scene's units
      this.waveAreaWidth = config.waveAreaWidth;

      // @public (read-only) {string} - text that describes the horizontal spatial axis
      this.graphHorizontalAxisLabel = config.graphHorizontalAxisLabel;

      // @public (read-only) {number} - length in meters to depict to indicate relative scale,
      // see LengthScaleIndicatorNode
      this.scaleIndicatorLength = config.scaleIndicatorLength;

      // @public (read-only) {string} - the units (in English and for the PhET-iO data stream)
      this.positionUnits = config.positionUnits;

      // @public (read-only) {string} - text to show to indicate the relative scale, see LengthScaleIndicatorNode
      this.scaleIndicatorText = StringUtils.fillIn( distanceUnitsString, {
        distance: this.scaleIndicatorLength,
        units: this.positionUnits
      } );

      // @public (read-only) {number} - scale factor to convert seconds of wall time to time for the given scene
      this.timeScaleFactor = config.timeScaleFactor;

      // @public (read-only) {string} - units for time, shown in the timer and optionally top right of the lattice
      this.timeUnits = config.timeUnits;

      const centerFrequency = ( config.minimumFrequency + config.maximumFrequency ) / 2;

      // @public {Property.<number>} - the frequency in the appropriate units for the scene
      this.frequencyProperty = new NumberProperty( config.initialFrequency || centerFrequency, {
        range: new Range( config.minimumFrequency, config.maximumFrequency )
      } );

      // wavelength*frequency=wave speed
      phet.log && this.frequencyProperty.link( frequency =>
        phet.log( `f = ${frequency}/${this.timeUnits}, w = ${config.waveSpeed / frequency} ${this.positionUnits}` )
      );

      // @public (read-only) {string} text to show on the vertical axis on the wave-area graph
      this.verticalAxisTitle = config.verticalAxisTitle;

      // @public (read-only) {string} - the title to the shown on the wave-area graph
      this.graphTitle = config.graphTitle;

      // @public (read-only) {string} - the unit to display on the WaveMeterNode, like "1 s"
      this.oneTimerUnit = StringUtils.fillIn( timeUnitsString, {
        time: 1,
        units: this.timeUnits
      } );

      // @public {Property.<Number>} - distance between the sources in the units of the scene, or 0 if there is only one
      // source initialized to match the initial slit separation,
      // see https://github.com/phetsims/wave-interference/issues/87
      this.sourceSeparationProperty = new NumberProperty(
        config.numberOfSources === 1 ? 0 : config.initialSlitSeparation, {
          units: this.positionUnits
        } );

      // @public {ModelViewTransform2} - converts the model coordinates (in the units for this scene) to lattice
      // coordinates, does not include damping regions
      this.modelToLatticeTransform = ModelViewTransform2.createRectangleMapping(
        new Rectangle( 0, 0, config.waveAreaWidth, config.waveAreaWidth ),

        // I do not understand why, but shifting indices by 1 is necessary to align particle model coordinates with
        // lattice coordinates, see https://github.com/phetsims/wave-interference/issues/174
        this.lattice.visibleBounds.shifted( -1, -1 )
      );

      // @public {Vector2} - horizontal location of the barrier in lattice coordinates (includes damping region)
      //                   - note: this is a floating point 2D representation to work seamlessly with DragListener
      //                   - see getBarrierLocation() for how to get the integral x-coordinate.
      //                   - Can be dragged by the node or handle below it.
      this.barrierLocationProperty = new Property( new Vector2( config.waveAreaWidth / 2, 0 ), {
        units: this.positionUnits
      } );

      // @public {NumberProperty} - width of the slit(s) opening in the units for this scene
      this.slitWidthProperty = new NumberProperty( config.initialSlitWidth, {
        units: this.positionUnits
      } );

      // @public {Property.<Number>} - distance between the center of the slits, in the units for this scene
      this.slitSeparationProperty = new NumberProperty( config.initialSlitSeparation, {
        units: this.positionUnits
      } );

      // @public (read-only) {number}
      this.waveSpeed = config.waveSpeed;

      // @public (read-only) {string} - displayed at the top right of the wave area
      this.timeScaleString = config.timeScaleString;

      // @public {NumberProperty} - controls the amplitude of the wave.
      this.amplitudeProperty = new NumberProperty( config.initialAmplitude, { range: new Range( 0, 10 ) } );

      // @public {Property.<WaveTemporalType>} - pulse or continuous
      this.waveTemporalTypeProperty = new Property( WaveTemporalType.CONTINUOUS, {
        validValues: WaveTemporalType.VALUES
      } );

      // The first button can trigger a pulse, or continuous wave, depending on the waveTemporalTypeProperty
      this.button1PressedProperty.lazyLink( isPressed => {
        if ( config.sceneType !== SceneType.WATER ) {
          if ( isPressed ) {
            this.resetPhase();
          }
          if ( isPressed && this.waveTemporalTypeProperty.value === WaveTemporalType.PULSE ) {
            this.startPulse();
          }
          else {

            // Water propagates via the water drop
            this.continuousWave1OscillatingProperty.value = isPressed;
          }
        }
      } );

      // The 2nd button starts the second continuous wave
      this.button2PressedProperty.lazyLink( isPressed => {
        if ( config.sceneType === SceneType.SOUND || config.sceneType === SceneType.LIGHT ) {
          if ( isPressed ) {
            this.resetPhase();
          }
          this.continuousWave2OscillatingProperty.value = isPressed;
        }
      } );

      // @public {BooleanProperty} - true while a single pulse is being generated
      this.pulseFiringProperty = new BooleanProperty( false );

      // When the pulse ends, the button pops out
      this.pulseFiringProperty.lazyLink( pulseFiring => {
        if ( !pulseFiring ) {
          this.button1PressedProperty.value = false;
        }
      } );

      // When the user selects "PULSE", the button pops out.
      this.waveTemporalTypeProperty.link( inputType => {
        if ( inputType === WaveTemporalType.PULSE ) {
          this.button1PressedProperty.value = false;
        }
      } );

      // @public (read-only) - the value of the wave at the oscillation point
      this.oscillator1Property = new NumberProperty( 0 );

      // @public (read-only) - the value of the wave at the oscillation point
      this.oscillator2Property = new NumberProperty( 0 );

      // @public {BooleanProperty} - true when the first source is continuously oscillating
      this.continuousWave1OscillatingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - true when the second source is continuously oscillating
      this.continuousWave2OscillatingProperty = new BooleanProperty( false );

      // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
      // for continuity
      const phaseUpdate = ( newFrequency, oldFrequency ) => {

        // For the main model, Math.sin is performed on angular frequency, so to match the phase, that computation
        // should also be based on angular frequencies
        const oldAngularFrequency = oldFrequency * Math.PI * 2;
        const newAngularFrequency = newFrequency * Math.PI * 2;
        const time = this.timeProperty.value;

        const oldValue = Math.sin( time * oldAngularFrequency + this.phase );
        let proposedPhase = Math.asin( oldValue ) - time * newAngularFrequency;
        const oldDerivative = Math.cos( time * oldAngularFrequency + this.phase );
        const newDerivative = Math.cos( time * newAngularFrequency + proposedPhase );

        // If wrong phase, take the sin value from the opposite side and move forward by half a cycle
        if ( oldDerivative * newDerivative < 0 ) {
          proposedPhase = Math.asin( -oldValue ) - time * newAngularFrequency + Math.PI;
        }

        this.phase = proposedPhase;

        // The wave area resets when the wavelength changes in the light scene
        if ( config.sceneType === SceneType.LIGHT ) {
          this.clear();
        }
      };
      this.frequencyProperty.lazyLink( phaseUpdate );

      // Everything below here is just for plane wave screen.
      if ( this.waveSpatialType === WaveSpatialType.PLANE ) {

        // @public {Property.<BarrierTypeEnum>} - type of the barrier in the lattice
        this.barrierTypeProperty = new Property( BarrierTypeEnum.ONE_SLIT, {
          validValues: BarrierTypeEnum.VALUES
        } );

        // When the barrier moves, it creates a lot of artifacts, so clear the wave to the right of the barrier
        // when it moves
        this.barrierLocationProperty.link( this.clear.bind( this ) );

        // @private {number} - phase of the wave so it doesn't start halfway through a cycle
        this.planeWavePhase = 0;

        // @protected {number} - record the time the button was pressed, so the SlitsScreenModel can propagate the right
        // distance
        this.button1PressTime = 0;
        this.button1PressedProperty.link( pressed => {
          if ( pressed ) {
            this.button1PressTime = this.timeProperty.value;

            // See setSourceValues
            const frequency = this.frequencyProperty.get();
            const wavelength = this.wavelength;
            const k = Math.PI * 2 / wavelength; // k is the wave number in sin(k*x-wt)
            const angularFrequency = frequency * Math.PI * 2;
            const x = this.modelToLatticeTransform.viewToModelX( this.lattice.dampX );

            // Solve for k * x - angularFrequency * this.timeProperty.value + phase = 0
            this.planeWavePhase = angularFrequency * this.timeProperty.value - k * x;
          }
          else {
            this.clear();
          }
        } );

        // When a barrier is added, clear the waves to the right instead of letting them dissipate,
        // see https://github.com/phetsims/wave-interference/issues/176
        this.barrierTypeProperty.link( barrierType => {
          this.clear();

          const frontTime = this.timeProperty.value - this.button1PressTime;
          const frontPosition = this.modelToLatticeTransform.modelToViewX( this.waveSpeed * frontTime );
          const barrierLatticeX = Util.roundSymmetric( this.modelToLatticeTransform.modelToViewX( this.getBarrierLocation() ) );

          // if the wave had passed by the barrier, then repropagate from the barrier.  This requires back-computing the
          // time the button would have been pressed to propagate the wave to the barrier.  Hence this is the inverse of
          // the logic in setSourceValues
          if ( frontPosition > barrierLatticeX ) {
            this.button1PressTime = this.timeProperty.value - this.getBarrierLocation() / this.waveSpeed;
          }
        } );
      }
    }

    /**
     * Set the incoming source values, in this case it is a point source near the left side of the lattice (outside of
     * the damping region).
     * @override
     * @protected
     */
    setSourceValues() {
      const amplitude = this.amplitudeProperty.get();
      const time = this.timeProperty.value;
      if ( this.waveSpatialType === WaveSpatialType.POINT ) {
        const frequency = this.frequencyProperty.get();
        const period = 1 / frequency;
        const timeSincePulseStarted = time - this.pulseStartTime;
        const lattice = this.lattice;
        const isContinuous = ( this.waveTemporalTypeProperty.get() === WaveTemporalType.CONTINUOUS );
        const continuous1 = isContinuous && this.continuousWave1OscillatingProperty.get();
        const continuous2 = isContinuous && this.continuousWave2OscillatingProperty.get();

        if ( continuous1 || continuous2 || this.pulseFiringProperty.get() ) {

          // The simulation is designed to start with a downward wave, corresponding to water splashing in
          const frequency = this.frequencyProperty.value;
          const angularFrequency = Math.PI * 2 * frequency;

          // For 50% longer than one pulse, keep the oscillator fixed at 0 to prevent "ringing"
          let waveValue = ( this.pulseFiringProperty.get() && timeSincePulseStarted > period ) ? 0 :
                          -Math.sin( time * angularFrequency + this.phase ) * amplitude;

          // assumes a square lattice
          const sourceSeparation = this.sourceSeparationProperty.get();
          const separationInLatticeUnits = sourceSeparation / this.waveAreaWidth * this.lattice.visibleBounds.width;
          const distanceAboveAxis = Util.roundSymmetric( separationInLatticeUnits / 2 );

          // Named with a "J" suffix instead of "Y" to remind us we are working in integral (i,j) lattice coordinates.
          // To understand why we subtract 1 here, imagine for the sake of conversation that the lattice is 5 units wide
          // so the cells are indexed 0,1,2,3,4.  5/2 === 2.5, rounded up that is 3, so we must subtract 1 to find the
          // center of the lattice.
          const latticeCenterJ = Util.roundSymmetric( this.lattice.height / 2 ) - 1;

          // Point source
          if ( this.continuousWave1OscillatingProperty.get() || this.pulseFiringProperty.get() ) {
            const j = latticeCenterJ + distanceAboveAxis;
            lattice.setCurrentValue( WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE, j, waveValue );
            this.oscillator1Property.value = waveValue;
          }

          // Secondary source (note if there is only one source, this sets the same value as above)
          if ( this.continuousWave2OscillatingProperty.get() ) {
            const j = latticeCenterJ - distanceAboveAxis;
            lattice.setCurrentValue( WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE, j, waveValue );
            this.oscillator2Property.value = waveValue;
          }
        }
      }
      else {

        // plane waves
        const lattice = this.lattice;

        // Round this to make sure it appears at an integer cell column
        let barrierLatticeX = Util.roundSymmetric( this.modelToLatticeTransform.modelToViewX( this.getBarrierLocation() ) );
        const slitSeparationModel = this.slitSeparationProperty.get();

        const frontTime = time - this.button1PressTime;
        const frontPosition = this.modelToLatticeTransform.modelToViewX( this.waveSpeed * frontTime );

        const slitWidthModel = this.slitWidthProperty.get();
        const slitWidth = Util.roundSymmetric( this.modelToLatticeTransform.modelToViewDeltaY( slitWidthModel ) );
        const latticeCenterY = this.lattice.height / 2;

        // Take the desired frequency for the water scene, or the specified frequency of any other scene
        const frequency = this.frequencyProperty.get();
        const wavelength = this.wavelength;

        // Solve for the wave number
        // lambda * k = 2 * pi
        // k = 2pi/lambda
        const k = Math.PI * 2 / wavelength;

        // Scale the amplitude because it is calibrated for a point source, not a plane wave
        const angularFrequency = frequency * Math.PI * 2;

        // Split into 2 regions.
        // 1. The region where there could be a wave (if it matches the button press and isn't in the barrier)
        // 2. The empirical part beyond the barrier

        // In the incoming region, set all lattice values to be an incoming plane wave.  This prevents any reflections
        // and unwanted artifacts, see https://github.com/phetsims/wave-interference/issues/47
        if ( this.barrierTypeProperty.value === BarrierTypeEnum.NO_BARRIER ) {
          barrierLatticeX = lattice.width - lattice.dampX;
        }
        for ( let i = lattice.dampX; i <= barrierLatticeX; i++ ) {

          // Find the physical model coordinate corresponding to the lattice coordinate
          const x = this.modelToLatticeTransform.viewToModelX( i );

          for ( let j = 0; j < lattice.height; j++ ) {
            const y = this.modelToLatticeTransform.viewToModelY( j );

            // Zero out values in the barrier
            let isCellInBarrier = false;

            if ( i === barrierLatticeX ) {
              if ( this.barrierTypeProperty.value === BarrierTypeEnum.ONE_SLIT ) {
                const low = j > latticeCenterY + slitWidth / 2 - 0.5;
                const high = j < latticeCenterY - slitWidth / 2 - 0.5;
                isCellInBarrier = low || high;
              }
              else if ( this.barrierTypeProperty.value === BarrierTypeEnum.TWO_SLITS ) {

                // Spacing is between center of slits.  This computation is done in model coordinates
                const topBarrierWidth = ( this.waveAreaWidth - slitWidthModel - slitSeparationModel ) / 2;
                const centralBarrierWidth = this.waveAreaWidth - 2 * topBarrierWidth - 2 * slitWidthModel;
                const inTop = y <= topBarrierWidth;
                const inBottom = y >= this.waveAreaWidth - topBarrierWidth;
                const inCenter = ( y >= topBarrierWidth + slitWidthModel ) &&
                                 ( y <= topBarrierWidth + slitWidthModel + centralBarrierWidth );
                isCellInBarrier = inTop || inBottom || inCenter;
              }
            }
            if ( this.button1PressedProperty.get() && !isCellInBarrier ) {

              // If the coordinate is past where the front of the wave would be, then zero it out.
              if ( i >= frontPosition ) {
                lattice.setCurrentValue( i, j, 0 );
              }
              else {
                const amplitude = amplitude * PLANE_WAVE_MAGNITUDE;
                const value = amplitude * Math.sin( k * x - angularFrequency * time + this.planeWavePhase );
                lattice.setCurrentValue( i, j, value );
              }
            }
            else {

              // Instantly clear the incoming wave, otherwise there are too many reflections
              lattice.setCurrentValue( i, j, 0 );
            }
          }
        }
      }
    }

    /**
     * Additionally called from the "step" button
     * @param {number} wallDT - amount of wall time that passed, will be scaled by time scaling value
     * @param {boolean} manualStep - true if the step button is being pressed
     * @public
     */
    advanceTime( wallDT, manualStep ) {

      const frequency = this.frequencyProperty.get();
      const period = 1 / frequency;

      const dt = wallDT * this.timeScaleFactor;
      this.timeProperty.value += dt;

      // If the pulse is running, end the pulse after one period
      if ( this.pulseFiringProperty.get() ) {
        const timeSincePulseStarted = this.timeProperty.value - this.pulseStartTime;

        // For 50% longer than one pulse, keep the oscillator fixed at 0 to prevent "ringing"
        if ( timeSincePulseStarted > period * 1.5 ) {
          this.pulseFiringProperty.set( false );
          this.pulseStartTime = 0;
        }
      }

      // Update the lattice
      this.lattice.step( () => this.setSourceValues() );

      // Scene-specific physics updates
      this.step( dt );

      // Notify listeners about changes
      this.lattice.changedEmitter.emit();
    }

    /**
     * Returns the horizontal barrier location.  Note, this is the floating point value, and some clients may need to
     * round it.
     * @returns {number}
     * @public
     */
    getBarrierLocation() {
      return this.barrierLocationProperty.get().x;
    }

    clear() {
      this.lattice.clear();
    }

    /**
     * Start the sine argument at 0 so it will smoothly form the first wave.
     * @private
     */
    resetPhase() {
      const frequency = this.frequencyProperty.get();
      const angularFrequency = Math.PI * 2 * frequency;

      // Solve for the sin arg = 0 in Math.sin( this.time * angularFrequency + this.phase )
      this.phase = -this.timeProperty.value * angularFrequency;
    }

    /**
     * Returns the wavelength in the units of the scene
     * @returns {number}
     * @public
     */
    get wavelength() {
      return this.waveSpeed / this.frequencyProperty.get();
    }

    /**
     * Returns a Bounds2 for the visible part of the wave area, in the coordinates of the scene.
     * @returns {Bounds2} the lattice model bounds, in the coordinates of this scene.
     * @public
     */
    getWaveAreaBounds() {
      return new Rectangle( 0, 0, this.waveAreaWidth, this.waveAreaWidth );
    }

    startPulse() {
      assert && assert( !this.pulseFiringProperty.value, 'Cannot fire a pulse while a pulse is already being fired' );
      this.resetPhase();
      this.pulseFiringProperty.value = true;
      this.pulseStartTime = this.timeProperty.value;
    }

    /**
     * Restores the initial conditions of this scene.
     * @public
     */
    reset() {
      this.lattice.clear();
      this.frequencyProperty.reset();
      this.slitWidthProperty.reset();
      this.barrierLocationProperty.reset();
      this.slitSeparationProperty.reset();
      this.sourceSeparationProperty.reset();
      this.amplitudeProperty.reset();
      this.waveTemporalTypeProperty.reset();
      this.button1PressedProperty.reset();
      this.button2PressedProperty.reset();
      this.oscillator1Property.reset();
      this.oscillator2Property.reset();
      this.continuousWave1OscillatingProperty.reset();
      this.continuousWave2OscillatingProperty.reset();
    }

    /**
     * Move forward in time by the specified amount
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( dt ) {

      // No-op here, subclasses can override to provide behavior.
    }
  }

  return waveInterference.register( 'Scene', Scene );
} );