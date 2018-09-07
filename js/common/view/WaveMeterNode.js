// Copyright 2018, University of Colorado Boulder

/**
 * Provides simulation-specific values and customizations to display a ScrollingChartNode in a MeterBodyNode.
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
  const MeterBodyNode = require( 'SCENERY_PHET/MeterBodyNode' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Property = require( 'AXON/Property' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const ScrollingChartNode = require( 'GRIDDLE/ScrollingChartNode' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveMeterProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveMeterProbeNode' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );

  // strings
  const timeString = require( 'string!WAVE_INTERFERENCE/time' );

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

  class WaveMeterNode extends MeterBodyNode {

    /**
     * @param {WavesScreenModel} model - model for reading values
     * @param {WavesScreenView|null} view - for getting coordinates for model
     * @param {DragListener} dragListener
     * @param {Object} [options]
     */
    constructor( model, view, dragListener, options ) {
      options = _.extend( {
        timeDivisions: NUMBER_OF_TIME_DIVISIONS
      }, options );
      const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, WIDTH, HEIGHT ), {
        cursor: 'pointer'
      } );

      super( backgroundNode, dragListener, options );

      // @public {boolean} - true if dragging the MeterBodyNode also causes attached probes to translate.
      // This is accomplished by calling alignProbes() on drag start and each drag event.
      this.synchronizeProbeLocations = false;

      // @public {Emitter} - emits when the probes should be put in standard relative location to the body
      this.alignProbesEmitter = new Emitter();

      // These do not need to be disposed because there is no connection to the "outside world"
      const leftBottomProperty = new NodeProperty( backgroundNode, 'bounds', 'leftBottom' );

      // @public {Emitter} emits when the WaveMeterNode has been dropped
      this.droppedEmitter = new Emitter();
      var droppedEmitter = this.droppedEmitter;

      /**
       * @param {Color|string} color
       * @param {Color|string} wireColor
       * @param {number} dx - initial relative x coordinate for the probe
       * @param {number} dy - initial relative y coordinate for the probe
       * @param {Property.<Vector2>} connectionProperty
       * @returns { color, probeNode, series, emitter }
       */
      const initializeSeries = ( color, wireColor, dx, dy, connectionProperty ) => {
        const snapToCenter = () => {
          if ( model.rotationAmountProperty.value !== 0 && model.sceneProperty.value === model.waterScene ) {
            var point = view.waveAreaNode.center;
            var global = view.waveAreaNode.parentToGlobalPoint( point );
            var local = probeNode.globalToParentPoint( global );
            probeNode.setY( local.y );
          }
        };
        const probeNode = new WaveMeterProbeNode( {
          color,
          drag: snapToCenter
        } );

        if ( view ) {

          // Move probes to centerline when the meter body is dropped
          droppedEmitter.addListener( snapToCenter );

          // Move probes when rotation is changed
          model.rotationAmountProperty.link( snapToCenter );
        }

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
        // this.alignProbesEmitter.addListener( alignProbes );
        alignProbes();
        this.on( 'visible', alignProbes );
        this.alignProbesEmitter.addListener( alignProbes );

        const series = [];
        const emitter = new Emitter();

        const updateSamples = function() {

          // Set the range by incorporating the model's time units, so it will match with the timer.
          const maxSeconds = NUMBER_OF_TIME_DIVISIONS;

          if ( model.isWaveMeterInPlayAreaProperty.get() ) {

            // Look up the location of the cell. The probe node has the cross-hairs at 0,0, so we can use the translation
            // itself as the sensor hot spot.  This doesn't include the damping regions
            const latticeCoordinates = view.globalToLatticeCoordinate( probeNode.parentToGlobalPoint( probeNode.getTranslation() ) );

            const sampleI = latticeCoordinates.x + model.lattice.dampX;
            const sampleJ = latticeCoordinates.y + model.lattice.dampY;

            if ( model.lattice.visibleBoundsContains( sampleI, sampleJ ) ) {
              const value = model.lattice.getCurrentValue( sampleI, sampleJ );
              series.push( new Vector2( model.timeProperty.value, value ) );
            }
          }
          while ( series.length > 0 && series[ 0 ].x < model.timeProperty.value - maxSeconds ) {
            series.shift();
          }
          emitter.emit();
        };

        if ( !options.isIcon ) {

          // Redraw the probe data when the scene changes
          const clear = () => {
            series.length = 0;
            updateSamples();
          };
          model.sceneProperty.link( clear );
          model.resetEmitter.addListener( clear );

          // When the wave is paused and the user is dragging the entire MeterBodyNode with the probes aligned, they
          // need to sample their new locations.
          probeNode.on( 'transform', updateSamples );
          model.lattice.changedEmitter.addListener( updateSamples );
        }
        return { color, probeNode, series, emitter };
      };

      const aboveBottomLeft1 = new DerivedProperty( [ leftBottomProperty ], position => position.plusXY( 0, -20 ) );
      const aboveBottomLeft2 = new DerivedProperty( [ leftBottomProperty ], position => position.plusXY( 0, -10 ) );
      const series1 = initializeSeries( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10, aboveBottomLeft1 );
      const series2 = initializeSeries( SERIES_2_COLOR, WIRE_2_COLOR, 36, 54, aboveBottomLeft2 );

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

      // Create the scrolling chart content and add it to the background.  There is an order-of-creation cycle which
      // prevents the scrolling node from being added to the background before the super() call, so this will have to suffice.
      const scrollingChartNode = new ScrollingChartNode(
        verticalAxisTitleNode,
        scaleIndicatorText,
        model.timeProperty,
        WIDTH,
        HEIGHT,
        [ series1, series2 ],
        timeString,
        _.omit( options, 'scale' ) // Don't apply the scale to both parent and children
      );
      backgroundNode.addChild( scrollingChartNode );
    }
  }

  return waveInterference.register( 'WaveMeterNode', WaveMeterNode );
} );