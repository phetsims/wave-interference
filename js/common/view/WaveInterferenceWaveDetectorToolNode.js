// Copyright 2018, University of Colorado Boulder

/**
 * Adds the panel to the wave detector background.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const ScrollingChartNode = require( 'WAVE_INTERFERENCE/common/view/ScrollingChartNode' );
  const WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const WaveDetectorToolProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolProbeNode' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );
  const Color = require( 'SCENERY/util/Color' );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const WIRE_1_COLOR = SERIES_1_COLOR;
  const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );
  const NUMBER_OF_TIME_DIVISIONS = 4; // TODO: factor out

  // For the wires
  const NORMAL_DISTANCE = 25;
  const PROBE_ATTACHMENT_POINT = 'centerBottom';
  const WIRE_LINE_WIDTH = 3;

  class WaveInterferenceWaveDetectorToolNode extends WaveDetectorToolNode {

    /**
     * @param {WavesScreenModel} model - model for reading values
     * @param {WavesScreenView|null} view - for getting coordinates for model
     * @param {Object} [options]
     */
    constructor( model, view, options ) {
      const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, 181.5, 145.2 ), {
        cursor: 'pointer'
      } );
      super( backgroundNode, options );

      // These do not need to be disposed because there is no connection to the "outside world"
      const rightBottomProperty = new NodeProperty( backgroundNode, 'bounds', 'rightBottom' );

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
        // TODO: connection point should vary as probes move.  Or try connecting at the center with no normal?
        this.addChild( new WireNode( connectionProperty, new Property( new Vector2( NORMAL_DISTANCE, 0 ) ),
          new NodeProperty( probeNode, 'bounds', PROBE_ATTACHMENT_POINT ), new Property( new Vector2( 0, NORMAL_DISTANCE ) ), {
            lineWidth: WIRE_LINE_WIDTH,
            stroke: wireColor
          }
        ) );
        this.addChild( probeNode );

        // Standard location in toolbox and when dragging out of toolbox.
        const alignProbes = () => probeNode.mutate( { left: backgroundNode.right + dx, top: backgroundNode.top + dy } );
        this.alignProbesEmitter.addListener( alignProbes );
        alignProbes();

        return probeNode;
      };

      // @private {Node}
      this.probe1Node = createProbeAndWire( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10,
        new DerivedProperty( [ rightBottomProperty ], position => position.plusXY( 0, -20 ) )
      );

      // @private {Node}
      this.probe2Node = createProbeAndWire( SERIES_2_COLOR, WIRE_2_COLOR, 36, 54,
        new DerivedProperty( [ rightBottomProperty ], position => position.plusXY( 0, -10 ) )
      );

      const probe1Samples = [];
      const probe2Samples = [];

      const updateSamples = function( probeNode, probeSamples, scene ) {

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

            probeSamples.push( new Vector2( model.time, value ) );
          }
        }
        while ( probeSamples.length > 0 && probeSamples[ 0 ].x < model.time - maxSeconds ) {
          probeSamples.shift();
        }
      };

      // When the wave is paused and the user is dragging the entire WaveDetectorToolNode with the probes aligned, they
      // need to sample their new locations.
      this.probe1Node.on( 'transform', () => updateSamples( this.probe1Node, probe1Samples, model.sceneProperty.value ) );
      this.probe2Node.on( 'transform', () => updateSamples( this.probe2Node, probe2Samples, model.sceneProperty.value ) );

      // TODO: embed onto the background as a child in the constructor
      // TODO: factor out constants for backgroundNode width and height
      const waveDetectorToolContentNode = new ScrollingChartNode( model, backgroundNode.width, backgroundNode.height, probe1Samples, probe2Samples, options );
      backgroundNode.addChild( waveDetectorToolContentNode );
    }
  }

  return waveInterference.register( 'WaveInterferenceWaveDetectorToolNode', WaveInterferenceWaveDetectorToolNode );
} );