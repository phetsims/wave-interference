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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const THUMB_SIZE = new Dimension2( 13, 22 );
  const DEFAULT_FONT = new PhetFont( 15 );
  const MAJOR_TICK_LENGTH = 12;

  const WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500,
    MAJOR_TICK_LENGTH: MAJOR_TICK_LENGTH,

    // These constants are used for the NumberControls to give them a consistent looks
    NUMBER_CONTROL_OPTIONS: {
      trackSize: new Dimension2( 100, 1 ),
      majorTickLength: MAJOR_TICK_LENGTH,
      thumbSize: THUMB_SIZE,
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 3 } ),
      arrowButtonScale: 0.65,
      titleFont: DEFAULT_FONT,
      titleMaxWidth: 100,
      valueMaxWidth: 60
    },
    THUMB_SIZE: THUMB_SIZE,
    DEFAULT_FONT: DEFAULT_FONT,
    WATER_SIDE_COLOR: new Color( '#58c0fa' ),

    // The IntensityGraphPanel and LightScreenNode have a shared maximum, this value indicates the wave amplitude that
    // maps to the highest value on the chart or brightest node in the LightScreenNode. If the source amplitude or
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

    // Cell that oscillates, specified as an offset from the origin of the lattice (includes damping region).  This
    // value must be coordinated with WaterEmitterNode's waterDrops[ index ].centerX
    POINT_SOURCE_HORIZONTAL_COORDINATE: 23,

    // The lattice must have an odd dimension, so that there can be a cell exactly in the middle, and symmetry for the
    // two oscillator screen.  See https://github.com/phetsims/wave-interference/issues/167
    LATTICE_DIMENSION: 101,

    // Number of cells around the boundary of the lattice to avoid reflections at the edge
    LATTICE_PADDING: 20,

    // maxWidth for the right hand side panels
    PANEL_MAX_WIDTH: 200,

    // maxWidth for slider ticks
    TICK_MAX_WIDTH: 30,

    // Parameters for sound.  These are constants in the simulation, but wrapped in Properties for fine
    // tuning with developer controls.

    // The random motion of the particles
    SOUND_PARTICLE_RANDOMNESS_PROPERTY: new Property( 14.75 ),

    // Additional scaling for the home force
    SOUND_PARTICLE_RESTORATION_SCALE: new Property( 0.5 ),

    // Scaling factor for friction (1.0 = no friction)
    SOUND_PARTICLE_FRICTION_SCALE_PROPERTY: new Property( 0.732 ),

    // Additional scaling for the gradient force
    SOUND_PARTICLE_GRADIENT_FORCE_SCALE_PROPERTY: new Property( 0.67 ),

    // Use for the time and length scale texts above the wave area, looks best to be a smidge smaller than the
    // rest of the texts
    TIME_AND_LENGTH_SCALE_INDICATOR_FONT: new PhetFont( 14 ),

    // TODO: delete or keep?  Fine tuning and discussion in https://github.com/phetsims/wave-interference/issues/142
    CUTOFF: new Property( 0.4 )
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );