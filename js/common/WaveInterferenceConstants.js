// Copyright 2018, University of Colorado Boulder

/**
 * Constants for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var THUMB_SIZE = new Dimension2( 16, 28 );

  var WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500,

    // These constants are used for the NumberControls to give them a consistent looks
    NUMBER_CONTROL_OPTIONS: {
      trackSize: new Dimension2( 100, 3 ),
      majorTickLength: 12,
      valuePattern: '{0} nm',
      thumbSize: new Dimension2( 22, 30 ),
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    },
    THUMB_SIZE: THUMB_SIZE,
    WATER_SIDE_COLOR: '#58c0fa',

    // The IntensityGraphPanel and ScreenNode have a shared maximum, this value indicates the wave amplitude that
    // maps to the highest value on the chart or brightest node in the ScreenNode. If the source amplitude or
    // attenuation as altered, this would likely need to change.  When tuning this, use a reddinsh wavelength because
    // for unknown reasons it yields a higher output amplitude
    MAX_AMPLITUDE_TO_PLOT_ON_RIGHT: 2.14,

    // Size of a cell in view coordinates, // TODO: this number no longer seems to matter
    CELL_WIDTH: 10
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );