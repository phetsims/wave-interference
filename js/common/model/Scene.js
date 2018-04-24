// Copyright 2016, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types, and coordinate frames.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  function Scene( config ) {
    this.latticeWidth = config.latticeWidth; // in meters
    this.minimumFrequency = config.minimumFrequency;
    this.maximumFrequency = config.maximumFrequency;
    this.scaleIndicatorText = config.scaleIndicatorText; // // TODO: i18n
    this.scaleIndicatorLength = config.scaleIndicatorLength; // in meters
    this.timeScaleFactor = config.timeScaleFactor;
    this.measuringTapeUnits = config.measuringTapeUnits;
    this.metricConversion = config.metricConversion;

    // @public {Property.<number>} - the frequency in Hz
    this.frequencyProperty = new Property( ( config.minimumFrequency + config.maximumFrequency ) / 2 );
  }

  waveInterference.register( 'Scene', Scene );

  inherit( Object, Scene, {

    // TODO: docs
    reset: function() {
      this.frequencyProperty.reset();
    }
  } );
  return Scene;
} );