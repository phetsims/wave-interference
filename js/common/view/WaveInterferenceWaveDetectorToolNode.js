// Copyright 2018, University of Colorado Boulder

/**
 * Provides simulation-specific values and customizations to display a ScrollingChartNode in a WaveDetectorToolNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Property = require( 'AXON/Property' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const ScrollingChartNode = require( 'WAVE_INTERFERENCE/common/view/ScrollingChartNode' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Vector2 = require( 'DOT/Vector2' );
  const WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  const WaveDetectorToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolProbeNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const WIRE_1_COLOR = SERIES_1_COLOR;
  const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );
  const NUMBER_OF_TIME_DIVISIONS = 4;
  const AXIS_LABEL_FILL = 'white';
  const LABEL_FONT_SIZE = 14;
  const WIDTH = 181.5;
  const HEIGHT = 145.2;

  // For the wires
  const NORMAL_DISTANCE = 25;
  const WIRE_LINE_WIDTH = 3;

  class WaveInterferenceWaveDetectorToolNode extends WaveDetectorToolNode {

    /**
     * @param {WavesScreenModel} model - model for reading values
     * @param {WavesScreenView|null} view - for getting coordinates for model
     * @param {Object} [options]
     */
    constructor( model, view, options ) {
      options = _.extend( {
        timeDivisions: NUMBER_OF_TIME_DIVISIONS
      }, options );
      const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, WIDTH, HEIGHT ), {
        cursor: 'pointer'
      } );
      super( backgroundNode, options );

      // These do not need to be disposed because there is no connection to the "outside world"
      const leftBottomProperty = new NodeProperty( backgroundNode, 'bounds', 'leftBottom' );

      /**
       * @param {Color|string} color
       * @param {Color|string} wireColor
       * @param {number} dx
       * @param {number} dy
       * @param {Property.<Vector2>} connectionProperty
       */
      const createProbeAndWire = ( color, wireColor, dx, dy, connectionProperty ) => {
        const probeNode = new WaveDetectorToolProbeNode( { color } );

        // Add the wire behind the probe.
        this.addChild( new WireNode( connectionProperty, new Property( new Vector2( -NORMAL_DISTANCE, 0 ) ),
          new NodeProperty( probeNode, 'bounds', 'centerBottom' ), new Property( new Vector2( 0, NORMAL_DISTANCE ) ), {
            lineWidth: WIRE_LINE_WIDTH,
            stroke: wireColor
          }
        ) );
        this.addChild( probeNode );

        // Standard location in toolbox and when dragging out of toolbox.
        const alignProbes = () => probeNode.mutate( { right: backgroundNode.left - dx, top: backgroundNode.top + dy } );
        this.alignProbesEmitter.addListener( alignProbes );
        alignProbes();

        return probeNode;
      };

      // @private {Node}
      this.probe1Node = createProbeAndWire( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10,
        new DerivedProperty( [ leftBottomProperty ], position => position.plusXY( 0, -20 ) )
      );

      // @private {Node}
      this.probe2Node = createProbeAndWire( SERIES_2_COLOR, WIRE_2_COLOR, 36, 54,
        new DerivedProperty( [ leftBottomProperty ], position => position.plusXY( 0, -10 ) )
      );

      const probe1Samples = [];
      const probe2Samples = [];

      const updateSamples = function( probeNode, probeSamples, scene, emitter ) {

        // Set the range by incorporating the model's time units, so it will match with the timer.
        const maxSeconds = NUMBER_OF_TIME_DIVISIONS / scene.timeUnitsConversion;

        if ( model.isWaveDetectorToolNodeInPlayAreaProperty.get() ) {

          // Look up the location of the cell. The probe node has the cross-hairs at 0,0, so we can use the translation
          // itself as the sensor hot spot.  This doesn't include the damping regions
          const latticeCoordinates = view.globalToLatticeCoordinate( probeNode.parentToGlobalPoint( probeNode.getTranslation() ) );

          const sampleI = latticeCoordinates.x + model.lattice.dampX;
          const sampleJ = latticeCoordinates.y + model.lattice.dampY;

          if ( model.lattice.visibleBoundsContains( sampleI, sampleJ ) ) {
            const value = model.lattice.getCurrentValue( sampleI, sampleJ );

            probeSamples.push( new Vector2( model.timeProperty.value, value ) );
          }
        }
        while ( probeSamples.length > 0 && probeSamples[ 0 ].x < model.timeProperty.value - maxSeconds ) {
          probeSamples.shift();
        }
        emitter.emit();
      };

      const series1Emitter = new Emitter();
      const series2Emitter = new Emitter();

      // When the wave is paused and the user is dragging the entire WaveDetectorToolNode with the probes aligned, they
      // need to sample their new locations.
      const update1 = () => updateSamples( this.probe1Node, probe1Samples, model.sceneProperty.value, series1Emitter );
      const update2 = () => updateSamples( this.probe2Node, probe2Samples, model.sceneProperty.value, series2Emitter );

      if ( !options.isIcon ) {

        // Redraw the probe data when the scene changes
        var clear = () => {
          probe1Samples.length = 0;
          probe2Samples.length = 0;
          update1();
          update2();
        };
        model.sceneProperty.link( clear );
        model.resetEmitter.addListener( clear );

        this.probe1Node.on( 'transform', update1 );
        this.probe2Node.on( 'transform', update2 );

        // TODO: embed onto the background as a child in the constructor
        // TODO: factor out constants for backgroundNode width and height

        model.lattice.changedEmitter.addListener( update1 );
        model.lattice.changedEmitter.addListener( update2 );
      }

      const verticalAxisTitleNode = new SceneToggleNode( model, scene => new WaveInterferenceText( scene.verticalAxisTitle, {
          fontSize: LABEL_FONT_SIZE,
          rotation: -Math.PI / 2,
          fill: AXIS_LABEL_FILL
        } )
      );
      const scaleIndicatorText = new SceneToggleNode( model, scene => new WaveInterferenceText( scene.oneTimerUnit, {
        fontSize: 11,
        fill: 'white'
      } ) );

      const waveDetectorToolContentNode = new ScrollingChartNode(
        verticalAxisTitleNode,
        scaleIndicatorText,
        model.timeProperty,
        WIDTH,
        HEIGHT, [
          { series: probe1Samples, emitter: series1Emitter, color: SERIES_1_COLOR },
          { series: probe2Samples, emitter: series2Emitter, color: SERIES_2_COLOR }
        ], _.omit( options, 'scale' ) );
      backgroundNode.addChild( waveDetectorToolContentNode );
    }
  }

  return waveInterference.register( 'WaveInterferenceWaveDetectorToolNode', WaveInterferenceWaveDetectorToolNode );
} );