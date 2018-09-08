// Copyright 2018, University of Colorado Boulder

/**
 * Constants for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const THUMB_SIZE = new Dimension2( 16, 28 );

  const WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500,

    // These constants are used for the NumberControls to give them a consistent looks
    NUMBER_CONTROL_OPTIONS: {
      trackSize: new Dimension2( 100, 3 ),
      majorTickLength: 12,
      thumbSize: new Dimension2( 22, 30 ),
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    },
    THUMB_SIZE: THUMB_SIZE,
    WATER_SIDE_COLOR: new Color( '#58c0fa' ),

    // The IntensityGraphPanel and ScreenNode have a shared maximum, this value indicates the wave amplitude that
    // maps to the highest value on the chart or brightest node in the ScreenNode. If the source amplitude or
    // attenuation as altered, this would likely need to change.  When tuning this, use a reddish wavelength because
    // for unknown reasons it yields a higher output amplitude
    MAX_AMPLITUDE_TO_PLOT_ON_RIGHT: 2.14,

    // Size of a cell in view coordinates
    CELL_WIDTH: 10,

    // lineJoin for the graph and the surface of the water
    CHART_LINE_JOIN: 'round',

    // Look of the emitter button across all 3 scenes
    EMITTER_BUTTON_COLOR: 'red',
    EMITTER_BUTTON_RADIUS: 14,

    FEMTO: 1E-15,

    // Cell that oscillates, specified as an offset from the origin of the lattice (includes damping region).  This value
    // must be coordinated with WaterEmitterNode's waterDrops[ index ].centerX
    POINT_SOURCE_HORIZONTAL_COORDINATE: 23,

    // Number of cells around the boundary of the lattice to avoid reflections at the edge
    LATTICE_PADDING: 20
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );