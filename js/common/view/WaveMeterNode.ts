// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Provides simulation-specific values and customizations to display a SeismographNode in a chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import DynamicSeries from '../../../../griddle/js/DynamicSeries.js';
import SeismographNode from '../../../../griddle/js/SeismographNode.js';
import isHMR from '../../../../phet-core/js/isHMR.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import { Color, HBox, InteractiveHighlightingNode, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import waveMeterSawTone_mp3 from '../../../sounds/waveMeterSawTone_mp3.js';
import waveMeterSmoothTone_mp3 from '../../../sounds/waveMeterSmoothTone_mp3.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import getWaveMeterNodeOutputLevel from './getWaveMeterNodeOutputLevel.js';
import SceneToggleNode from './SceneToggleNode.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveMeterProbeNode from './WaveMeterProbeNode.js';

isHMR && module.hot.accept( './getWaveMeterNodeOutputLevel.js', _.noop );

const timeString = WaveInterferenceStrings.time;

// sounds
const sounds = [ waveMeterSawTone_mp3, waveMeterSmoothTone_mp3 ];

// constants
const SERIES_1_COLOR = '#191919';
const SERIES_2_COLOR = '#808080';
const WIRE_1_COLOR = SERIES_1_COLOR;
const WIRE_2_COLOR = new Color( SERIES_2_COLOR ).darkerColor( 0.7 );
const NUMBER_OF_TIME_DIVISIONS = 4;
const AXIS_LABEL_FILL = 'white';
const LABEL_FONT_SIZE = 14;

// For the wires
const NORMAL_DISTANCE = 25;
const WIRE_LINE_WIDTH = 3;

class WaveMeterNode extends Node {

  /**
   * @param model - model for reading values
   * @param view - for getting coordinates for model
   * @param [options]
   */
  public constructor( model, view, options ) {
    options = merge( {
      timeDivisions: NUMBER_OF_TIME_DIVISIONS,

      // Prevent adjustment of the control panel rendering while dragging,
      // see https://github.com/phetsims/wave-interference/issues/212
      preventFit: true
    }, options );

    // interactive highlighting - highlights will surround the draggable background on mouse and touch
    const backgroundNode = new InteractiveHighlightingNode( { cursor: 'pointer' } );

    super();

    // @public (read-only) {Node} - shows the background for the chart.  Any attached probes or other
    // supplemental nodes should not be children of the backgroundNode if they need to translate independently.
    this.backgroundNode = backgroundNode;

    // @private {DragListener} - set by setDragListener
    this.backgroundDragListener = null;

    this.addChild( this.backgroundNode );

    // Mutate after backgroundNode is added as a child
    this.mutate( options );

    // @public {boolean} - true if dragging the chart also causes attached probes to translate.
    // This is accomplished by calling alignProbes() on drag start and each drag event.
    this.synchronizeProbePositions = false;

    // @public - emits when the probes should be put in standard relative position to the body
    this.alignProbesEmitter = new Emitter();

    // @private - triggered when the probe is reset
    this.resetEmitter = new Emitter();

    // These do not need to be disposed because there is no connection to the "outside world"
    const leftBottomProperty = new DerivedProperty( [ this.backgroundNode.boundsProperty ], bounds => bounds.leftBottom );

    // @public - emits when the WaveMeterNode has been dropped
    this.droppedEmitter = new Emitter();
    const droppedEmitter = this.droppedEmitter;

    /**
     * @param color
     * @param wireColor
     * @param dx - initial relative x coordinate for the probe
     * @param dy - initial relative y coordinate for the probe
     * @param connectionProperty
     * @param sounds
     * @param soundIndexProperty
     * @param playbackRateProperty
     * @param volumeProperty
     * @param isPlayingProperty
     * @param seriesVolume
     */
    const initializeSeries = ( color, wireColor, dx, dy, connectionProperty, sounds, soundIndexProperty, playbackRateProperty, volumeProperty, isPlayingProperty, seriesVolume ): DynamicSeries => {
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
        dragStart: () => this.moveToFront(),
        drag: snapToCenter
      } );
      const lowProperty = new Property( 0.75 );
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
        new DerivedProperty( [ probeNode.boundsProperty ], bounds => bounds.centerBottom ),
        new Vector2Property( new Vector2( 0, NORMAL_DISTANCE ) ), {
          lineWidth: WIRE_LINE_WIDTH,
          stroke: wireColor
        }
      ) );
      this.addChild( probeNode );

      // Standard position in toolbox and when dragging out of toolbox.
      const alignProbes = () => {
        probeNode.mutate( {
          right: backgroundNode.left - dx,
          top: backgroundNode.top + dy
        } );

        // Prevent the probes from going out of the visible bounds when tagging along with the dragged WaveMeterNode
        probeNode.translation = view.visibleBoundsProperty.value.closestPointTo( probeNode.translation );
      };
      this.visibleProperty.lazyLink( alignProbes );
      this.alignProbesEmitter.addListener( alignProbes );

      const dynamicSeries = new DynamicSeries( { color: color } );
      dynamicSeries.probeNode = probeNode;

      const updateSamples = () => {

        // Set the range by incorporating the model's time units, so it will match with the timer.
        const maxSeconds = NUMBER_OF_TIME_DIVISIONS;

        const scene = model.sceneProperty.value;
        if ( model.isWaveMeterInPlayAreaProperty.get() ) {

          // Look up the coordinates of the cell. The probe node has the cross-hairs at 0,0, so we can use the
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

            if ( !soundManager.hasSoundGenerator( soundClip ) ) {
              soundManager.addSoundGenerator( soundClip, { associatedViewNode: this } );
            }

            // 19dB (the amount the audio file was decreased by) corresponds to this amplitude scale, see
            // https://github.com/phetsims/wave-interference/issues/485#issuecomment-634295284
            const amplitudeScale = 8.912509381337454;
            const outputLevel = getWaveMeterNodeOutputLevel( value ) * amplitudeScale * seriesVolume;

            // "Play Tone" takes precedence over the wave meter node sounds, because it is meant to be used briefly
            const isDucking = model.sceneProperty.value === model.soundScene && model.soundScene.isTonePlayingProperty.value;
            const duckFactor = isDucking ? 0.1 : 1;

            // Set the main volume.  If the sound clip wasn't playing, set the sound immediately to correct an audio
            // blip when the probe enters the play area.  If the sound clip was playing, use a longer time constant
            // to eliminate clipping, scratching sounds when dragging the probes quickly
            const amplitudeValue = model.isRunningProperty.value ? outputLevel * volumeProperty.value : 0;
            soundClip.setOutputLevel( duckFactor * amplitudeValue, soundClip.isPlaying ? 0.03 : 0.0 );

            if ( !soundClip.isPlaying ) {
              soundClip.play();
              isPlayingProperty.value = true;
            }

            const basePlaybackRate = lowProperty.value * playbackRateProperty.value;
            if ( value > 0 ) {
              soundClip.setPlaybackRate( basePlaybackRate * 4 / 3 ); // Perfect 4th
            }
            else {
              soundClip.setPlaybackRate( basePlaybackRate );
            }
          }
          else {
            soundClip.stop();
            isPlayingProperty.value = false;
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

      // When the wave is paused and the user is dragging the entire chart with the probes aligned, they
      // need to sample their new positions.
      probeNode.transformEmitter.addListener( updateSamples );

      model.isRunningProperty.link( updateSamples );

      // When a Scene's lattice changes, update the samples
      model.scenes.forEach( scene => scene.lattice.changedEmitter.addListener( updateSamples ) );
      return dynamicSeries;
    };

    const aboveBottomLeft1Property = new DerivedProperty(
      [ leftBottomProperty ],
      position => position.isFinite() ? position.plusXY( 0, -20 ) : Vector2.ZERO
    );
    const aboveBottomLeft2Property = new DerivedProperty(
      [ leftBottomProperty ],
      position => position.isFinite() ? position.plusXY( 0, -10 ) : Vector2.ZERO
    );

    // Hooks for customization in the dev tools
    const waveMeterSound1Property = new Property( 0 );
    const waveMeterSound2Property = new Property( 1 );

    const waveMeterSound1PlaybackRateProperty = new Property( 1 );
    const waveMeterSound2PlaybackRateProperty = new Property( 1.01 );

    const waveMeterSound1VolumeProperty = new Property( 0.1 );
    const waveMeterSound2VolumeProperty = new Property( 0.05 );

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

    const series1PlayingProperty = new BooleanProperty( false );
    const series2PlayingProperty = new BooleanProperty( false );

    const series1 = initializeSeries( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10, aboveBottomLeft1Property, sounds1,
      waveMeterSound1Property, waveMeterSound1PlaybackRateProperty, waveMeterSound1VolumeProperty, series1PlayingProperty,
      1.0 );

    const series2 = initializeSeries( SERIES_2_COLOR, WIRE_2_COLOR, 42, 54, aboveBottomLeft2Property, sounds2,
      waveMeterSound2Property, waveMeterSound2PlaybackRateProperty, waveMeterSound2VolumeProperty, series2PlayingProperty,
      0.42 );

    // @public {DerivedProperty.<number>} - Turn down the water drops, speaker or light sound when the wave meter is being used.
    this.duckingProperty = new DerivedProperty( [ series1PlayingProperty, series2PlayingProperty ], ( a, b ) => {
      if ( a || b ) {
        return 0.3;
      }
      else {
        return 1;
      }
    } );

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

    const seismographNode = new SeismographNode( timeProperty, [ series1, series2 ], scaleIndicatorText, {
      width: 150,
      height: 110,
      verticalAxisLabelNode: verticalAxisTitleNode,
      horizontalAxisLabelNode: horizontalAxisTitleNode,
      showVerticalGridLabels: false
    } );
    const shadedRectangle = new ShadedRectangle( seismographNode.bounds.dilated( 7 ) );
    shadedRectangle.addChild( seismographNode );
    backgroundNode.addChild( shadedRectangle );

    this.alignProbesEmitter.emit();
  }

  /**
   * Reset the probe when dropped back in the toolbox.
   */
  public reset(): void {
    this.resetEmitter.emit();
    this.alignProbesEmitter.emit();
  }

  /**
   * Gets the region of the background in global coordinates.  This can be used to determine if the chart
   * should be dropped back in a toolbox.
   */
  public getBackgroundNodeGlobalBounds(): Bounds2 {
    return this.localToGlobalBounds( this.backgroundNode.bounds );
  }

  /**
   * Forward an event from the toolbox to start dragging the node in the play area.  This triggers the probes (if any)
   * to drag together with the chart.  This is accomplished by calling this.alignProbes() at each drag event.
   */
  public startDrag( event ): void {

    // Forward the event to the drag listener
    this.backgroundDragListener.press( event, this.backgroundNode );
  }

  /**
   * Set the drag listener, wires it up and uses it for forwarding events from the toolbox icon.
   */
  public setDragListener( dragListener ): void {
    assert && assert( this.backgroundDragListener === null, 'setDragListener must be called no more than once' );
    this.backgroundDragListener = dragListener;
    this.backgroundNode.addInputListener( dragListener );
  }
}

waveInterference.register( 'WaveMeterNode', WaveMeterNode );
export default WaveMeterNode;
