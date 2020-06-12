// Copyright 2018-2020, University of Colorado Boulder

/**
 * Provides simulation-specific values and customizations to display a SeismographNode in a MeterBodyNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
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
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import NodeProperty from '../../../../scenery/js/util/NodeProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import sawTone from '../../../sounds/wave-meter-saw-tone_mp3.js';
import smoothTone from '../../../sounds/wave-meter-smooth-tone_mp3.js';
import waveInterference from '../../waveInterference.js';
import waveInterferenceStrings from '../../waveInterferenceStrings.js';
import getWaveMeterNodeOutputLevel from './getWaveMeterNodeOutputLevel.js';
import SceneToggleNode from './SceneToggleNode.js';
import WaveInterferenceText from './WaveInterferenceText.js';
import WaveMeterProbeNode from './WaveMeterProbeNode.js';

isHMR && module.hot.accept( './getWaveMeterNodeOutputLevel.js', () => {} );

const timeString = waveInterferenceStrings.time;

// sounds
const sounds = [ sawTone, smoothTone ];

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
    this.synchronizeProbePositions = false;

    // @public - emits when the probes should be put in standard relative position to the body
    this.alignProbesEmitter = new Emitter();

    // @private - triggered when the probe is reset
    this.resetEmitter = new Emitter();

    // These do not need to be disposed because there is no connection to the "outside world"
    const leftBottomProperty = new NodeProperty( backgroundNode, backgroundNode.boundsProperty, 'leftBottom' );

    // @public - emits when the WaveMeterNode has been dropped
    this.droppedEmitter = new Emitter();
    const droppedEmitter = this.droppedEmitter;

    /**
     * @param {Color|string} color
     * @param {Color|string} wireColor
     * @param {number} dx - initial relative x coordinate for the probe
     * @param {number} dy - initial relative y coordinate for the probe
     * @param {Property<Vector2>} connectionProperty
     * @param {SoundClip[]} sounds
     * @param {Property<number>} soundIndexProperty
     * @param {Property<boolean>} playbackRateProperty
     * @param {Property<boolean>} volumeProperty
     * @param {Property<boolean>} isPlayingProperty
     * @param {number} seriesVolume
     * @returns {DynamicSeries}
     */
    const initializeSeries = ( color, wireColor, dx, dy, connectionProperty, sounds, soundIndexProperty, playbackRateProperty, volumeProperty, isPlayingProperty, seriesVolume ) => {
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
        new NodeProperty( probeNode, probeNode.boundsProperty, 'centerBottom' ), new Vector2Property( new Vector2( 0, NORMAL_DISTANCE ) ), {
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
            const duckFactor = isDucking ? 0.2 : 1;

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

      // When the wave is paused and the user is dragging the entire MeterBodyNode with the probes aligned, they
      // need to sample their new positions.
      probeNode.transformEmitter.addListener( updateSamples );

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

    const series1 = initializeSeries( SERIES_1_COLOR, WIRE_1_COLOR, 5, 10, aboveBottomLeft1, sounds1,
      waveMeterSound1Property, waveMeterSound1PlaybackRateProperty, waveMeterSound1VolumeProperty, series1PlayingProperty,
      1.0 );

    const series2 = initializeSeries( SERIES_2_COLOR, WIRE_2_COLOR, 42, 54, aboveBottomLeft2, sounds2,
      waveMeterSound2Property, waveMeterSound2PlaybackRateProperty, waveMeterSound2VolumeProperty, series2PlayingProperty,
      0.42 );

    // Turn down the water drops, speaker or light sound when the wave meter is being used.
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

    const seismographNode = new SeismographNode( timeProperty, [ series1, series2 ], verticalAxisTitleNode,
      horizontalAxisTitleNode, scaleIndicatorText, {
        width: 150,
        height: 110,
        showVerticalGridLabels: false
      } );
    const shadedRectangle = new ShadedRectangle( seismographNode.bounds.dilated( 7 ) );
    shadedRectangle.addChild( seismographNode );
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

waveInterference.register( 'WaveMeterNode', WaveMeterNode );
export default WaveMeterNode;
