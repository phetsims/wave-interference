// Copyright 2018, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types, coordinate frames, relative scale, etc.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'DOT/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // strings
  const distanceUnitsString = require( 'string!WAVE_INTERFERENCE/distanceUnits' );
  const timeUnitsString = require( 'string!WAVE_INTERFERENCE/timeUnits' );

  class Scene {

    /**
     * @param {Object} config - see below for required properties
     */
    constructor( config ) {

      // @public (read-only) {string} - units for this scene
      this.translatedPositionUnits = config.translatedPositionUnits;

      // @public (read-only) {number} - width of the visible part of the lattice in the scene's units
      this.waveAreaWidth = config.waveAreaWidth;

      // @public (read-only) {string} - text that describes the horizontal spatial axis
      this.graphHorizontalAxisLabel = config.graphHorizontalAxisLabel;

      // @public (read-only) {number} - minimum allowed frequency in Hz
      this.minimumFrequency = config.minimumFrequency;

      // @public (read-only) {number} - maximum allowed frequency in Hz
      this.maximumFrequency = config.maximumFrequency;

      // @public (read-only) {number} [initialFrequency] - initial frequency in Hz, defaults to the average of min and max
      this.initialFrequency = config.initialFrequency || ( config.minimumFrequency + config.maximumFrequency ) / 2;

      // @public (read-only) {number} - length in meters to depict to indicate relative scale, see LengthScaleIndicatorNode
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

      // @public {Property.<number>} - the linear frequency in the appropriate units for the scene
      this.frequencyProperty = new Property( this.initialFrequency );

      // @public (read-only) {string} - units for time, shown in the timer and optionally at the top right of the lattice
      this.timeUnits = config.timeUnits;

      // @public (read-only) {string} text to show on the vertical axis on the wave-area graph
      this.verticalAxisTitle = config.verticalAxisTitle;

      // @public (read-only) {string} - the title to the shown on the wave-area graph
      this.graphTitle = config.graphTitle;

      // @public (read-only) {string} - the unit to display on the WaveMeterNode, like "1 s"
      this.oneTimerUnit = StringUtils.fillIn( timeUnitsString, {
        time: 1,
        units: this.timeUnits
      } );

      // @public {Property.<Number>} - distance between the sources in the units of the scene, or 0 if there is only one source
      // initialized to match the initial slit separation, see https://github.com/phetsims/wave-interference/issues/87
      this.sourceSeparationProperty = new NumberProperty( config.numberOfSources === 1 ? 0 : config.initialSlitSeparation, {
        units: this.positionUnits
      } );

      // @public {ModelViewTransform2} - converts the model coordinates (in the units for this scene) to lattice
      // coordinates, does not include damping regions
      this.modelToLatticeTransform = ModelViewTransform2.createRectangleMapping(
        new Rectangle( 0, 0, config.waveAreaWidth, config.waveAreaWidth ),
        config.lattice.visibleBounds
      );

      // @public {Vector2} - horizontal location of the barrier in lattice coordinates (includes damping region)
      //                   - note: this is a floating point 2D representation so it can work seamlessly with DragListener
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
    }

    /**
     * Returns the horizontal barrier location.  Note, this is the floating point value, and some clients may need to round it.
     * @public
     */
    getBarrierLocation() {
      return this.barrierLocationProperty.get().x;
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

    /**
     * Restores the initial conditions of this scene.
     * @public
     */
    reset() {
      this.frequencyProperty.reset();
      this.slitWidthProperty.reset();
      this.barrierLocationProperty.reset();
      this.slitSeparationProperty.reset();
      this.sourceSeparationProperty.reset();
    }

    /**
     * Move forward in time by the specified amount
     * @param {WavesScreenModel} model
     * @param {number} dt - amount of time to move forward, in the units of the scene
     */
    step( model, dt ) {

      // No-op here, subclasses can override to provide behavior.
    }
  }

  return waveInterference.register( 'Scene', Scene );
} );