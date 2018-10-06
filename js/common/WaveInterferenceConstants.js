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

  const WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500,

    // These constants are used for the NumberControls to give them a consistent looks
    NUMBER_CONTROL_OPTIONS: {
      trackSize: new Dimension2( 100, 1 ), // TODO: factor out TrackSize with WaveInterferenceSlider
      majorTickLength: 12,
      thumbSize: new Dimension2( 13, 22 ), // TODO: share these with
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } ),
      arrowButtonScale: 0.65,
      titleFont: new PhetFont( 15 ) // TODO: match with WaveInterferenceText
    },
    THUMB_SIZE: THUMB_SIZE,
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

    // Cell that oscillates, specified as an offset from the origin of the lattice (includes damping region).  This value
    // must be coordinated with WaterEmitterNode's waterDrops[ index ].centerX
    POINT_SOURCE_HORIZONTAL_COORDINATE: 23,

    // The lattice must have an odd dimension, so that there can be a cell exactly in the middle, and symmetry for the
    // two oscillator screen.  See https://github.com/phetsims/wave-interference/issues/167
    LATTICE_DIMENSION: 101,

    // Number of cells around the boundary of the lattice to avoid reflections at the edge
    LATTICE_PADDING: 20,

    // Parameters for sound.  These are constants in the simulation, but wrapped in Properties for fine
    // tuning with developer controls.

    // The random motion of the particles
    SOUND_PARTICLE_RANDOMNESS_PROPERTY: new Property( 16 ),

    // How strongly the particles are attracted to their initial position
    SOUND_PARTICLE_RESTORATION_SPRING_CONSTANT_PROPERTY: new Property( 3.5 ),

    // Scaling factor for friction (1.0 = no friction)
    SOUND_PARTICLE_FRICTION_SCALE_PROPERTY: new Property( 0.85 ),

    // Magnitude of the gradient force from the wave
    SOUND_PARTICLE_GRADIENT_FORCE_SCALE_PROPERTY: new Property( 100 )
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );