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
  const WaveDetectorToolContentNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolContentNode' );
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
       * @param {Color} color
       * @param {Color} wireColor
       * @param {number} dx
       * @param {number} dy
       * @param {Property.<Vector2>} connectionProperty
       */
      const createProbeAndWire = ( color, wireColor, dx, dy, connectionProperty ) => {
        const probeNode = new WaveDetectorToolProbeNode( { color } );

        // Add the wire behind the probe.
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

      // TODO: embed onto the background as a child
      const waveDetectorToolContentNode = new WaveDetectorToolContentNode( model, view, backgroundNode, this.probe1Node, this.probe2Node, options );
      this.addChild( waveDetectorToolContentNode );
    }
  }

  return waveInterference.register( 'WaveInterferenceWaveDetectorToolNode', WaveInterferenceWaveDetectorToolNode );
} );