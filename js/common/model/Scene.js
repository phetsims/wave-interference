// Copyright 2016, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types, coordinate frames, relative scale, etc.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Object} config - see below for required properties
   * @constructor
   */
  function Scene( config ) {

    // @public (read-only) {number} - width of the visible part of the lattice in meters
    this.latticeWidth = config.latticeWidth; // in meters

    // @public (read-only) {string} - text that describes the horizontal spatial axis
    this.graphHorizontalAxisLabel = config.graphHorizontalAxisLabel;

    // @public (read-only) {number} - minimum allowed frequency in Hz
    this.minimumFrequency = config.minimumFrequency;

    // @public (read-only) {number} - maximum allowed frequency in Hz
    this.maximumFrequency = config.maximumFrequency;

    // @public (read-only) {number} [initialFrequency] - initial frequency in Hz, defaults to the average of min and max
    this.initialFrequency = config.initialFrequency || ( config.minimumFrequency + config.maximumFrequency ) / 2;

    // @public (read-only) {string} - text to show to indicate the relative scale, see ScaleIndicatorNode
    this.scaleIndicatorText = config.scaleIndicatorText;

    // @public (read-only) {number} - length in meters to depict to indicate relative scale, see ScaleIndicatorNode
    this.scaleIndicatorLength = config.scaleIndicatorLength;

    // @public (read-only) {number} - scale factor to convert seconds of wall time to time for the given scene
    this.timeScaleFactor = config.timeScaleFactor;

    // @public (read-only) {string} - units to show for measurements
    this.measuringTapeUnits = config.measuringTapeUnits;

    // @public (read-only) {number} - factor for converting between units (like centimeters, nanometers)
    this.meterUnitsConversion = config.meterUnitsConversion;

    // @public (read-only) {number} - scale factor for converting between time units (like showing seconds in femtoseconds)
    this.timeUnitsConversion = config.timeUnitsConversion;

    // @public {Property.<number>} - the frequency in Hz
    this.frequencyProperty = new Property( this.initialFrequency );

    // @public (read-only) {string} - units associated with the time units conversion
    this.timerUnits = config.timerUnits;

    // @public (read-only) {string} text to show on the vertical axis on the wave-area graph
    this.verticalAxisTitle = config.verticalAxisTitle;

    // @public (read-only) {string} - the title to the shown on the wave-area graph
    this.graphTitle = config.graphTitle;
  }

  waveInterference.register( 'Scene', Scene );

  return inherit( Object, Scene, {

    /**
     * Restores the initial conditions of this scene.
     * @public
     */
    reset: function() {
      this.frequencyProperty.reset();
    }
  } );
} );