// Copyright 2018-2019, University of Colorado Boulder

/**
 * Provides simulation-specific values and customizations to display a ScrollingChartNode in a MeterBodyNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const DynamicSeries = require( 'GRIDDLE/DynamicSeries' );
  const Emitter = require( 'AXON/Emitter' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const PiecewiseLinearFunction = require( 'DOT/PiecewiseLinearFunction' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const ScrollingChartNode = require( 'GRIDDLE/ScrollingChartNode' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveMeterProbeNode = require( 'WAVE_INTERFERENCE/common/view/WaveMeterProbeNode' );
  const WireNode = require( 'SCENERY_PHET/WireNode' );

  // strings
  const timeString = require( 'string!WAVE_INTERFERENCE/time' );

  // sounds
  const etherealFluteSound = require( 'sound!WAVE_INTERFERENCE/ethereal-flute-for-meter-loop.mp3' );
  const organ2Sound = require( 'sound!WAVE_INTERFERENCE/organ-v2-for-meter-loop.mp3' );
  const organSound = require( 'sound!WAVE_INTERFERENCE/organ-for-meter-loop.mp3' );
  const sineSound = require( 'sound!TAMBO/220hz-saturated-sine-loop.mp3' );
  const sineSound2 = require( 'sound!WAVE_INTERFERENCE/220hz-saturated-sine-playback-rate-75.mp3' );
  const stringSound1 = require( 'sound!TAMBO/strings-loop-middle-c-oscilloscope.mp3' );
  const windSound1 = require( 'sound!TAMBO/winds-loop-middle-c-oscilloscope.mp3' );
  const windSound2 = require( 'sound!TAMBO/winds-loop-c3-oscilloscope.mp3' );
  const windyTone4 = require( 'sound!WAVE_INTERFERENCE/windy-tone-for-meter-loop-rate-75-pitch-matched-fixed.mp3' );
  const windyToneSound = require( 'sound!WAVE_INTERFERENCE/windy-tone-for-meter-loop.mp3' );

  const sounds = [ sineSound2, windyTone4, stringSound1, sineSound, windSound1, windSound2, etherealFluteSound, organ2Sound, organSound, windyToneSound ];

  const sounds1 = sounds.map( sound => {
    return new SoundClip( sound, {
      loop: true,
      trimSilence: false
    } );
  } );

  const sounds2 = sounds.map( sound => {
    return new SoundClip( sound, {
      loop: true,
      trimSilence: false
    } );
  } );

  // Hooks for customization in the dev tools
  window.waveMeterSound1Property = new Property( 0 );
  window.waveMeterSound2Property = new Property( 1 );

  window.waveMeterSound1PlaybackRateProperty = new Property( 1 );
  window.waveMeterSound2PlaybackRateProperty = new Property( 1.01 );

  window.waveMeterSound1VolumeProperty = new Property( 0.4 );
  window.waveMeterSound2VolumeProperty = new Property( 0.13 );

  window.waveMeterSound1VolumeProperty.debug( 'waveMeterSound1VolumeProperty' );
  window.waveMeterSound2VolumeProperty.debug( 'waveMeterSound2VolumeProperty' );

  window.waveMeterSound1PlaybackRateProperty.debug( 'waveMeterSound1PlaybackRateProperty' );
  window.waveMeterSound2PlaybackRateProperty.debug( 'waveMeterSound2PlaybackRateProperty' );

  window.waveMeterSound1Property.debug( 'waveMeterSound1Property' );
  window.waveMeterSound2Property.debug( 'waveMeterSound2Property' );
  window.waveMeterSound1Property.link( ( newSoundIndex, oldSoundIndex ) => {
    if ( typeof oldSoundIndex === 'number' ) {
      sounds1[ oldSoundIndex ].stop();
    }

    // new sound plays in step
  } );
  window.waveMeterSound2Property.link( ( newSoundIndex, oldSoundIndex ) => {
    if ( typeof oldSoundIndex === 'number' ) {
      sounds2[ oldSoundIndex ].stop();
    }

    // new sound plays in step
  } );

  // constants
  const SERIES_1_COLOR = '#5c5d5f'; // same as in Bending Light
  const SERIES_2_COLOR = '#ccced0'; // same as in Bending Light
  const WIRE_1_COLOR = SERIES_1_COLOR;
  const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );
  const NUMBER_OF_TIME_DIVISIONS = 4;
  const AXIS_LABEL_FILL = 'white';
  const LABEL_FONT_SIZE = 14;

  // For the wires
  const NORMAL_DISTANCE = 25;
  const WIRE_LINE_WIDTH = 3;

  const tops = [];
  const bottoms = [];
  window.setFrequencies = function( b, t ) {
    tops.forEach( top => top.set( t / 1000 ) );
    bottoms.forEach( bottom => bottom.set( b / 1000 ) );
  };

  class WaveMeterNode extends Node {

    /**
     * @param {WavesModel} model - model for reading values
     * @param {WavesScreenView} view - for getting coordinates for model
     * @param {Object} [options]
     */
    constructor( model, view, options ) {
      options = merge( {
        timeDivisions: NUMBER_OF_TIME_DIVISIONS,

        // Prevent adjustment of the control panel rendering while dragging,
        // see https://github.com/phetsims/wave-interference/issues/212
        preventFit: true
      }, options );
      const backgroundNode = new Node( { cursor: 'pointer' } );

      super();

      // @public (read-only) {Node} - shows the background for the MeterBodyNode.  Any attached probes or other
      // supplemental nodes should not be children of the backgroundNode if they need to translate independently.
      this.backgroundNode = backgroundNode;

      // @private {DragListener} - set by setDragListener
      this.backgroundDragListener = null;

      this.addChild( this.backgroundNode );

      // Mutate after backgroundNode is added as a child
      this.mutate( options );

      // @public {boolean} - true if dragging the MeterBodyNode also causes attached probes to translate.
      // This is accomplished by calling alignProbes() on drag start and each drag event.
      this.synchronizeProbeLocations = false;

      // @public - emits when the probes should be put in standard relative location to the body
      this.alignProbesEmitter = new Emitter();

      // @private - triggered when the probe is reset
      this.resetEmitter = new Emitter();

      // These do not need to be disposed because there is no connection to the "outside world"
      const leftBottomProperty = new NodeProperty( backgroundNode, 'bounds', 'leftBottom' );

      // @public - emits when the WaveMeterNode has been dropped
      this.droppedEmitter = new Emitter();
      const droppedEmitter = this.droppedEmitter;

      /**
       * @param {Color|string} color
       * @param {Color|string} wireColor
       * @param {number} dx - initial relative x coordinate for the probe
       * @param {number} dy - initial relative y coordinate for the probe
       * @param {Property.<Vector2>} connectionProperty
       * @param {boolean} sound - whether to use sound
       * @returns {DynamicSeries}
       */
      const initializeSeries = ( color, wireColor, dx, dy, connectionProperty, sounds, soundIndexProperty, playbackRateProperty, volumeProperty ) => {

        const snapToCenter = () => {
          if ( model.rotationAmountProperty.value !== 0 && model.sceneProperty.value === model.waterScene ) {
            const point = view.waveAreaNode.center;
            const global = view.waveAreaNode.parentToGlobalPoint( point );
            const local = probeNode.globalToParentPoint( global );
            probeNode.setY( local.y );
          }
        };
        const probeNode = new WaveMeterProbeNode( view.visibleBoundsProperty, {
          color: color,
          drag: snapToCenter
        } );
        const intervalProperty = new Property( 4 );
        const lowProperty = new Property( 0.75 );
        lowProperty.debug( 'lowProperty' );
        if ( phet.chipper.queryParameters.dev ) {
          probeNode.addChild( new VBox( {
            centerX: 0,
            top: 100,
            children: [
              new HBox( {
                spacing: 5,
                children: [
                  new RectangularPushButton( {
                    content: new Text( '-', { fontSize: 20 } ),
                    listener: () => {soundIndexProperty.value = Math.max( soundIndexProperty.value - 1, 0 );}
                  } ),
                  new RectangularPushButton( {
                    content: new Text( '+', { fontSize: 20 } ),
                    listener: () => {soundIndexProperty.value = Math.min( soundIndexProperty.value + 1, sounds.length - 1 );}
                  } )
                ]
              } ),
              new RadioButtonGroup( intervalProperty, [ { value: 3, node: new Text( '3', { fontSize: 20 } ) },
                { value: 4, node: new Text( '4', { fontSize: 20 } ) }, {
                  value: 5,
                  node: new Text( '5', { fontSize: 20 } )
                } ], {
                spacing: 1,
                orientation: 'horizontal'
              } ),
              new NumberControl( 'low', lowProperty, new Range( 0.25, 2.5 ), { delta: 0.05 } )
            ]
          } ) );
        }

        // Move probes to centerline when the meter body is dropped
        droppedEmitter.addListener( snapToCenter );

        // Move probes when rotation is changed
        model.rotationAmountProperty.link( snapToCenter );

        // Add the wire behind the probe.
        this.addChild( new WireNode( connectionProperty, new Vector2Property( new Vector2( -NORMAL_DISTANCE, 0 ) ),
          new NodeProperty( probeNode, 'bounds', 'centerBottom' ), new Vector2Property( new Vector2( 0, NORMAL_DISTANCE ) ), {
            lineWidth: WIRE_LINE_WIDTH,
            stroke: wireColor
          }
        ) );
        this.addChild( probeNode );

        // Standard location in toolbox and when dragging out of toolbox.
        const alignProbes = () => {
          probeNode.mutate( {
            right: backgroundNode.left - dx,
            top: backgroundNode.top + dy
          } );

          // Prevent the probes from going out of the visible bounds when tagging along with the dragged WaveMeterNode
          probeNode.translation = view.visibleBoundsProperty.value.closestPointTo( probeNode.translation );
        };
        this.on( 'visibility', alignProbes );
        this.alignProbesEmitter.addListener( alignProbes );

        const dynamicSeries = new DynamicSeries( { color: color } );
        dynamicSeries.probeNode = probeNode;

        const updateSamples = () => {

          // Set the range by incorporating the model's time units, so it will match with the timer.
          const maxSeconds = NUMBER_OF_TIME_DIVISIONS;

          const scene = model.sceneProperty.value;
          if ( model.isWaveMeterInPlayAreaProperty.get() ) {

            // Look up the location of the cell. The probe node has the cross-hairs at 0,0, so we can use the
            // translation itself as the sensor hot spot.  This doesn't include the damping regions
            const latticeCoordinates = view.globalToLatticeCoordinate(
              probeNode.parentToGlobalPoint( probeNode.getTranslation() )
            );

            const sampleI = latticeCoordinates.x + scene.lattice.dampX;
            const sampleJ = latticeCoordinates.y + scene.lattice.dampY;

            const soundClip = sounds[ soundIndexProperty.value ];

            if ( scene.lattice.visibleBoundsContains( sampleI, sampleJ ) ) {
              const value = scene.lattice.getCurrentValue( sampleI, sampleJ );
              dynamicSeries.addXYDataPoint( scene.timeProperty.value, value );

              // Linearize based on the sine value
              const clampedValue = Utils.clamp( value, -1.6, 1.6 );
              const normalized = Utils.linear( -1.6, 1.6, -1, 1, clampedValue );
              const arcsin1 = Math.asin( normalized ); // between -pi/2 and +pi/2
              const arcsin1Mapped = Utils.linear( -Math.PI / 2, Math.PI / 2, -1, 1, arcsin1 );
              const arcsin2 = Math.asin( arcsin1Mapped );
              const arcsin2Mapped = Utils.linear( -Math.PI / 2, Math.PI / 2, -1, 1, arcsin2 );

              if ( !soundManager.hasSoundGenerator( soundClip ) ) {
                soundManager.addSoundGenerator( soundClip, { associatedViewNode: this } );
              }

              let outputLevel = Math.abs( arcsin2Mapped );
              // console.log( outputLevel );

              if ( outputLevel < 0.05 ) {
                outputLevel = 0.05;
              }
              if ( outputLevel > 0.4 ) {
                outputLevel = 0.4;
              }

              // Roughly quadratic
              outputLevel = PiecewiseLinearFunction.evaluate( [
                0.05, 0,
                0.1, 0.05,
                0.2, 0.2,
                0.3, 0.5,
                0.4, 1
              ], outputLevel );

              // Set the main volume.  If the sound clip wasn't playing, set the sound immediately to correct an audio
              // blip when the probe enters the play area.  If the sound clip was playing, use a longer time constant
              // to eliminate clipping, scratching sounds when dragging the probes quickly
              soundClip.setOutputLevel( model.isRunningProperty.value ? outputLevel * volumeProperty.value : 0, soundClip.isPlaying ? 0.03 : 0.0 );

              // Work around a bug in Tambo that results in audio played even when outputLevel is 0.0
              if ( !soundClip.isPlaying ) { // TODO: playing a soundclip with outputLevel 0 plays something
                soundClip.play();
              }

              const basePlaybackRate = lowProperty.value * playbackRateProperty.value;
              if ( value > 0 ) {
                soundClip.setPlaybackRate( basePlaybackRate * ( intervalProperty.value === 5 ? 329.63 / 220 : intervalProperty.value === 4 ? 293.66 / 220 : 277.18 / 220 ) ); // 5th  (SR #1 pref)
              }
              else {
                soundClip.setPlaybackRate( basePlaybackRate );
              }
            }
            else {
              soundClip.stop();
            }
          }
          else {
            dynamicSeries.addXYDataPoint( scene.timeProperty.value, NaN );
          }
          while ( dynamicSeries.hasData() && dynamicSeries.getDataPoint( 0 ).x < scene.timeProperty.value - maxSeconds ) {
            dynamicSeries.shiftData();
          }
        };

        // Redraw the probe data when the scene changes
        const clear = () => {
          dynamicSeries.clear();
          updateSamples();
        };
        model.sceneProperty.link( clear );
        model.resetEmitter.addListener( clear );

        // The probe is also reset when dropped back in the toolbox.
        this.resetEmitter.addListener( clear );

        // When the wave is paused and the user is dragging the entire MeterBodyNode with the probes aligned, they
        // need to sample their new locations.
        probeNode.on( 'transform', updateSamples );

        model.isRunningProperty.link( updateSamples );

        // When a Scene's lattice changes, update the samples
        model.scenes.forEach( scene => scene.lattice.changedEmitter.addListener( updateSamples ) );
        return dynamicSeries;
      };

      const aboveBottomLeft1 = new DerivedProperty(
        [ leftBottomProperty ],
        position => position.isFinite() ? position.plusXY( 0, -20 ) : Vector2.ZERO
      );
      const aboveBottomLeft2 = new DerivedProperty(
        [ leftBottomProperty ],
        position => position.isFinite() ? position.plusXY( 0, -10 ) : Vector2.ZERO
      );

      const series1 = initializeSeries( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10, aboveBottomLeft1, sounds1, window.waveMeterSound1Property, window.waveMeterSound1PlaybackRateProperty, window.waveMeterSound1VolumeProperty );
      const series2 = initializeSeries( SERIES_2_COLOR, WIRE_2_COLOR, 42, 54, aboveBottomLeft2, sounds2, window.waveMeterSound2Property, window.waveMeterSound2PlaybackRateProperty, window.waveMeterSound2VolumeProperty );

      const verticalAxisTitleNode = new SceneToggleNode(
        model,
        scene => new WaveInterferenceText( scene.graphVerticalAxisLabel, {
          fontSize: LABEL_FONT_SIZE,
          rotation: -Math.PI / 2,
          fill: AXIS_LABEL_FILL
        } )
      );
      const horizontalAxisTitleNode = new WaveInterferenceText( timeString, {
        fontSize: LABEL_FONT_SIZE,
        fill: AXIS_LABEL_FILL
      } );
      const scaleIndicatorText = new SceneToggleNode(
        model,
        scene => new WaveInterferenceText( scene.oneTimerUnit, {
          fontSize: 11,
          fill: 'white'
        } )
      );

      // Create the scrolling chart content and add it to the background.  There is an order-of-creation cycle which
      // prevents the scrolling node from being added to the background before the super() call, so this will have to
      // suffice.
      //
      // Select the time for the selected scene.
      const timeProperty = new DynamicProperty( model.sceneProperty, {
        derive: 'timeProperty'
      } );

      const scrollingChartNode = new ScrollingChartNode( timeProperty, [ series1, series2 ], verticalAxisTitleNode,
        horizontalAxisTitleNode, scaleIndicatorText, {
          width: 150,
          height: 110,
          showVerticalGridLabels: false
        } );
      const shadedRectangle = new ShadedRectangle( scrollingChartNode.bounds.dilated( 7 ) );
      shadedRectangle.addChild( scrollingChartNode );
      backgroundNode.addChild( shadedRectangle );

      this.alignProbesEmitter.emit();
    }

    /**
     * Reset the probe when dropped back in the toolbox.
     * @public
     */
    reset() {
      this.resetEmitter.emit();
      this.alignProbesEmitter.emit();
    }

    /**
     * Gets the region of the background in global coordinates.  This can be used to determine if the MeterBodyNode
     * should be dropped back in a toolbox.
     * @returns {Bounds2}
     * @public
     */
    getBackgroundNodeGlobalBounds() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    }

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.  This triggers the probes (if any)
     * to drag together with the MeterBodyNode.  This is accomplished by calling this.alignProbes() at each drag event.
     * @param {Object} event
     * @public
     */
    startDrag( event ) {

      // Forward the event to the drag listener
      this.backgroundDragListener.press( event, this.backgroundNode );
    }

    /**
     * Set the drag listener, wires it up and uses it for forwarding events from the toolbox icon.
     * @param {DragListener} dragListener
     * @public
     */
    setDragListener( dragListener ) {
      assert && assert( this.backgroundDragListener === null, 'setDragListener must be called no more than once' );
      this.backgroundDragListener = dragListener;
      this.backgroundNode.addInputListener( dragListener );
    }
  }

  return waveInterference.register( 'WaveMeterNode', WaveMeterNode );
} );