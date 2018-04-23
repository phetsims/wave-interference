// Copyright 2016, University of Colorado Boulder

/**
 * The scene determines the medium and emitter types, and coordinate frames.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var Property = require( 'AXON/Property' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  function SceneType( config ) {
    this.latticeWidth = config.latticeWidth; // in meters
    this.minimumFrequency = config.minimumFrequency;
    this.maximumFrequency = config.maximumFrequency;
    this.scaleIndicatorText = config.scaleIndicatorText; // // TODO: i18n
    this.scaleIndicatorLength = config.scaleIndicatorLength; // in meters
    this.timeScaleFactor = config.timeScaleFactor;
    this.measuringTapeUnits = config.measuringTapeUnits;
    this.metricConversion = config.metricConversion;

    // TODO: odd to have state like this in a global module.  Move to normal instance pattern?
    this.frequencyProperty = new Property( ( config.minimumFrequency + config.maximumFrequency ) / 2 );
  }

  SceneType.WATER = new SceneType( {
    latticeWidth: 0.1, // 10 centimeters
    minimumFrequency: 1,
    maximumFrequency: 10,
    scaleIndicatorText: '1 centimeter',
    scaleIndicatorLength: 0.01, // 1 centimeter
    timeScaleFactor: 1,
    measuringTapeUnits: 'cm',
    metricConversion: 0.01
  } );

  SceneType.SOUND = new SceneType( {
    latticeWidth: 1, // 1 meter
    minimumFrequency: 1,
    maximumFrequency: 10,
    scaleIndicatorText: '10 centimeters',
    scaleIndicatorLength: 0.1, // 10 cm
    timeScaleFactor: 1,
    measuringTapeUnits: 'meters',
    metricConversion: 1
  } );

  SceneType.LIGHT = new SceneType( {
    latticeWidth: 4200E-9, // 4200 nanometers
    minimumFrequency: 1,
    maximumFrequency: 10,
    scaleIndicatorText: '500 nanometers',
    scaleIndicatorLength: 500E-9, // 500nm
    timeScaleFactor: 5E-15, // in one real (wall clock) second, 5E-15 femtoseconds should pass.
    measuringTapeUnits: 'nm',
    metricConversion: 1E-9
  } );

  SceneType.VALUES = [ SceneType.WATER, SceneType.SOUND, SceneType.LIGHT ];

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( SceneType ); }

  waveInterference.register( 'SceneType', SceneType );

  return SceneType;
} );