// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * View for the "Waves" screen.  Extended for the Interference and Slits screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import platform from '../../../../phet-core/js/platform.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import { Color, DragListener, Node, Rectangle, RichText, Text, Utils } from '../../../../scenery/js/imports.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import grab_mp3 from '../../../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import PhetioAction from '../../../../tandem/js/PhetioAction.js';
import SoundScene from '../../common/model/SoundScene.js';
import DashedLineNode from '../../common/view/DashedLineNode.js';
import DisturbanceTypeRadioButtonGroup from '../../common/view/DisturbanceTypeRadioButtonGroup.js';
import IntensityGraphPanel from '../../common/view/IntensityGraphPanel.js';
import LatticeCanvasNode from '../../common/view/LatticeCanvasNode.js';
import LengthScaleIndicatorNode from '../../common/view/LengthScaleIndicatorNode.js';
import LightScreenNode from '../../common/view/LightScreenNode.js';
import LightWaveGeneratorNode from '../../common/view/LightWaveGeneratorNode.js';
import Perspective3DNode from '../../common/view/Perspective3DNode.js';
import SceneToggleNode from '../../common/view/SceneToggleNode.js';
import SoundParticleCanvasLayer from '../../common/view/SoundParticleCanvasLayer.js';
import SoundParticleImageLayer from '../../common/view/SoundParticleImageLayer.js';
import SoundWaveGeneratorNode from '../../common/view/SoundWaveGeneratorNode.js';
import ToolboxPanel from '../../common/view/ToolboxPanel.js';
import ViewpointRadioButtonGroup from '../../common/view/ViewpointRadioButtonGroup.js';
import WaterDropLayer from '../../common/view/WaterDropLayer.js';
import WaterSideViewNode from '../../common/view/WaterSideViewNode.js';
import WaterWaveGeneratorNode from '../../common/view/WaterWaveGeneratorNode.js';
import WaveAreaGraphNode from '../../common/view/WaveAreaGraphNode.js';
import WaveAreaNode from '../../common/view/WaveAreaNode.js';
import WaveInterferenceControlPanel from '../../common/view/WaveInterferenceControlPanel.js';
import WaveInterferenceStopwatchNode from '../../common/view/WaveInterferenceStopwatchNode.js';
import WaveMeterNode from '../../common/view/WaveMeterNode.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../../common/WaveInterferenceUtils.js';
import waveInterference from '../../waveInterference.js';
import WavesModel from '../model/WavesModel.js';
import WavesScreenSoundView from './WavesScreenSoundView.js';

// constants
const MARGIN = WaveInterferenceConstants.MARGIN;
const SPACING = 6;
const WAVE_MARGIN = 8; // Additional margin shown around the wave lattice
const WATER_BLUE = WaveInterferenceConstants.WATER_SIDE_COLOR;
const fromFemto = WaveInterferenceUtils.fromFemto;

class WavesScreenView extends ScreenView {

  // shows the background of the wave area for sound view and used for layout
  public readonly waveAreaNode: WaveAreaNode;

  /**
   * @param model
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   * @param [options]
   */
  public constructor( model, alignGroup, options ) {

    options = merge( {

      // Only allow side view in single source/no slits context
      showViewpointRadioButtonGroup: false,

      // Allow the user to choose between pulse and continuous.
      showPulseContinuousRadioButtons: true,

      // If true, Nodes will be added that show each wave generator, otherwise none are shown.
      showSceneSpecificWaveGeneratorNodes: true,

      // Scale factor for the brightness on the LightScreenNode,
      // see https://github.com/phetsims/wave-interference/issues/161
      piecewiseLinearBrightness: false,

      lightScreenAveragingWindowSize: 3,

      // Nested options as discussed in https://github.com/phetsims/tasks/issues/730,
      // see WaveInterferenceControlPanel for keys/values
      controlPanelOptions: {},

      audioEnabled: false
    }, options );
    super();

    // Sounds for grab and release
    const soundClipOptions = { initialOutputLevel: 0.4 };
    const grabSound = new SoundClip( grab_mp3, soundClipOptions );
    soundManager.addSoundGenerator( grabSound, { categoryName: 'user-interface' } );

    const releaseSound = new SoundClip( release_mp3, soundClipOptions );
    soundManager.addSoundGenerator( releaseSound, { categoryName: 'user-interface' } );

    // @private
    this.model = model;

    // @private - shows the background of the wave area for sound view and used for layout
    this.waveAreaNode = new WaveAreaNode( {
      top: MARGIN + WAVE_MARGIN + 15,
      centerX: this.layoutBounds.centerX - 142
    } );
    this.addChild( this.waveAreaNode );

    // Initialize the view-related transforms in Scene
    model.scenes.forEach( scene => scene.setViewBounds( this.waveAreaNode.bounds ) );

    // Thin border to distinguish between the lattice node and the light screen.  This is not part of the
    // waveAreaNode because that would extend its bounds
    const borderNode = Rectangle.bounds( this.waveAreaNode.bounds.dilated( 1 ), {
      stroke: 'white',
      lineWidth: 1
    } );

    // @protected {Node} placeholder for z-ordering for subclasses
    this.afterWaveAreaNode = new Node();

    // show the length scale at the top left of the wave area
    const lengthScaleIndicatorNode = new SceneToggleNode(
      model,
      scene => new LengthScaleIndicatorNode( scene.scaleIndicatorLength * this.waveAreaNode.width / scene.waveAreaWidth, scene.scaleIndicatorText ), {
        alignChildren: ToggleNode.LEFT,
        bottom: this.waveAreaNode.top - 2,
        left: this.waveAreaNode.left
      } );
    this.addChild( lengthScaleIndicatorNode );

    // show the time scale at the top right of the wave area
    const timeScaleIndicatorNode = new SceneToggleNode(
      model,
      scene => new RichText( scene.timeScaleString, { font: WaveInterferenceConstants.TIME_AND_LENGTH_SCALE_INDICATOR_FONT } ), {
        alignChildren: ToggleNode.RIGHT,
        bottom: this.waveAreaNode.top - 2,
        right: this.waveAreaNode.right,
        maxWidth: 300
      } );
    this.addChild( timeScaleIndicatorNode );

    const waveAreaGraphNode = new WaveAreaGraphNode( model, this.waveAreaNode.bounds, {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.top + this.waveAreaNode.height * 0.75
    } );

    const dashedLineNode = new DashedLineNode( {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.centerY
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN
    } );

    // Create the canvases to render the lattices

    let waterDropLayer = null;
    if ( model.waterScene ) {
      this.waterCanvasNode = new LatticeCanvasNode( model.waterScene.lattice, { baseColor: WATER_BLUE } );
      waterDropLayer = new WaterDropLayer( model, this.waveAreaNode.bounds );
    }

    let soundParticleLayer = null;
    if ( model.soundScene ) {
      this.soundCanvasNode = new LatticeCanvasNode( model.soundScene.lattice, { baseColor: Color.white } );

      const createSoundParticleLayer = () => {

        // Too much garbage on firefox, so only opt in to WebGL for mobile safari (where it is needed most)
        // and where the garbage doesn't seem to slow it down much.
        const useWebgl = phet.chipper.queryParameters.webgl && platform.mobileSafari && Utils.isWebGLSupported;
        const node = useWebgl ?
                     new SoundParticleImageLayer( model, this.waveAreaNode.bounds, { center: this.waveAreaNode.center } ) :
                     new SoundParticleCanvasLayer( model, this.waveAreaNode.bounds, { center: this.waveAreaNode.center } );

        // Don't let the particles appear outside of the wave area.  This works on the canvas layer but not webgl.
        node.clipArea = Shape.bounds( this.waveAreaNode.bounds ).transformed( Matrix3.translation( -node.x, -node.y ) );

        // Note: Clipping is not enabled on mobileSafari, see https://github.com/phetsims/wave-interference/issues/322
        return node;
      };

      // Show the sound particles for the sound Scene, or a placeholder for the Slits screen, which does not show
      // SoundParticles
      soundParticleLayer = model.soundScene.showSoundParticles ? createSoundParticleLayer() : new Node();
    }

    if ( model.lightScene ) {
      this.lightCanvasNode = new LatticeCanvasNode( model.lightScene.lattice );
    }

    this.sceneToNode = scene => scene === model.waterScene ? this.waterCanvasNode :
                                scene === model.soundScene ? this.soundCanvasNode :
                                this.lightCanvasNode;
    this.latticeNode = new SceneToggleNode( model, this.sceneToNode );
    model.showWavesProperty.linkAttribute( this.latticeNode, 'visible' );

    const latticeScale = this.waveAreaNode.width / this.latticeNode.width;
    this.latticeNode.mutate( {
      scale: latticeScale,
      center: this.waveAreaNode.center
    } );

    let lightScreenNode = null;

    if ( model.lightScene ) {
      lightScreenNode = new LightScreenNode( model.lightScene.lattice, model.lightScene.intensitySample, {
        piecewiseLinearBrightness: options.piecewiseLinearBrightness,
        lightScreenAveragingWindowSize: options.lightScreenAveragingWindowSize,
        scale: latticeScale,
        left: this.waveAreaNode.right + 5,
        y: this.waveAreaNode.top
      } );

      // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
      Multilink.multilink( [ model.showScreenProperty, model.sceneProperty ], ( showScreen, scene ) => {
        lightScreenNode.visible = showScreen && scene === model.lightScene;
      } );

      // Set the color of highlight on the screen and lattice
      model.lightScene.frequencyProperty.link( lightFrequency => {
        const baseColor = VisibleColor.frequencyToColor( fromFemto( lightFrequency ) );
        this.lightCanvasNode.setBaseColor( baseColor );
        this.lightCanvasNode.vacuumColor = Color.black;
        lightScreenNode.setBaseColor( baseColor );
      } );
      model.showScreenProperty.linkAttribute( lightScreenNode, 'visible' );

      this.addChild( lightScreenNode );
    }

    this.addChild( this.latticeNode );
    this.addChild( borderNode );

    if ( model.lightScene ) {

      // Match the size of the scale indicator
      const numberGridLines = model.lightScene.waveAreaWidth / model.lightScene.scaleIndicatorLength;
      const intensityGraphPanel = new IntensityGraphPanel(
        this.latticeNode.height,
        model.lightScene.intensitySample,
        numberGridLines,
        model.resetEmitter, {
          left: lightScreenNode.right + 5
        } );
      Multilink.multilink( [ model.showScreenProperty, model.showIntensityGraphProperty, model.sceneProperty ],
        ( showScreen, showIntensityGraph, scene ) => {

          // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
          intensityGraphPanel.visible = showScreen && showIntensityGraph && scene === model.lightScene;
        } );
      this.addChild( intensityGraphPanel );

      // Make sure the charting area is perfectly aligned with the wave area
      intensityGraphPanel.translate(
        0, this.latticeNode.globalBounds.top - intensityGraphPanel.getChartGlobalBounds().top
      );
    }

    /**
     * Return the measuring tape Property value for the specified scene.  See MeasuringTapeNode constructor docs.
     * @param scene
     */
    const getMeasuringTapeValue = scene => {
      return {
        name: scene.translatedPositionUnits,

        // The measuring tape tip and tail are in the view coordinate frame, this scale factor converts to model
        // coordinates according to the scene
        multiplier: scene.waveAreaWidth / this.waveAreaNode.width
      };
    };

    const measuringTapeProperty = new Property( getMeasuringTapeValue( model.sceneProperty.value ) );
    model.sceneProperty.link( scene => measuringTapeProperty.set( getMeasuringTapeValue( scene ) ) );

    /**
     * Checks if the toolbox intersects the given bounds, to see if a tool can be dropped back into the toolbox.
     */
    const toolboxIntersects = b => toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds ).intersectsBounds( b );

    const measuringTapeNode = new MeasuringTapeNode( measuringTapeProperty, {

      // translucent white background, same value as in Projectile Motion, see https://github.com/phetsims/projectile-motion/issues/156
      textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )',
      textColor: 'black',
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,

      baseDragStarted: () => {
        grabSound.play();
      },

      // Drop in toolbox
      baseDragEnded: () => {
        releaseSound.play();
        if ( toolboxIntersects( measuringTapeNode.localToGlobalBounds( measuringTapeNode.getLocalBaseBounds() ) ) ) {
          model.isMeasuringTapeInPlayAreaProperty.value = false;

          // Reset the rotation and length of the Measuring Tape when it is returned to the toolbox.
          measuringTapeNode.reset();
        }
      }
    } );
    this.visibleBoundsProperty.link( visibleBounds => measuringTapeNode.setDragBounds( visibleBounds.eroded( 20 ) ) );
    model.isMeasuringTapeInPlayAreaProperty.linkAttribute( measuringTapeNode, 'visible' );

    const stopwatchNode = new WaveInterferenceStopwatchNode( model, {
      dragBoundsProperty: this.visibleBoundsProperty,

      dragListenerOptions: {
        start: () => {
          grabSound.play();
        },
        end: () => {
          releaseSound.play();
          if ( toolboxIntersects( stopwatchNode.parentToGlobalBounds( stopwatchNode.bounds ) ) ) {
            model.stopwatch.reset();
          }
        }
      }
    } );

    const waveMeterNode = new WaveMeterNode( model, this );
    model.resetEmitter.addListener( () => waveMeterNode.reset() );
    model.resetEmitter.addListener( () => measuringTapeNode.reset() );
    model.isWaveMeterInPlayAreaProperty.link( inPlayArea => waveMeterNode.setVisible( inPlayArea ) );

    // Original bounds of the waveMeterNode so we can set the draggable bounds accordingly, so it can go edge to edge
    // in every dimension.
    const bounds = waveMeterNode.backgroundNode.bounds.copy();

    // Subtract the dimensions from the visible bounds so that it will abut the edge of the screen
    const waveMeterBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
      return new Bounds2(
        visibleBounds.minX - bounds.minX, visibleBounds.minY - bounds.minY,
        visibleBounds.maxX - bounds.maxX, visibleBounds.maxY - bounds.maxY
      );
    } );

    // Keep the WaveMeterNode in bounds when the window is reshaped.
    waveMeterBoundsProperty.link( bounds => {
      const closestPointInBounds = bounds.closestPointTo( waveMeterNode.backgroundNode.translation );
      return waveMeterNode.backgroundNode.setTranslation( closestPointInBounds );
    } );
    this.waveMeterNode = waveMeterNode;
    waveMeterNode.setDragListener( new DragListener( {
      dragBoundsProperty: waveMeterBoundsProperty,
      translateNode: true,
      start: () => {
        grabSound.play();
        waveMeterNode.moveToFront();
        if ( waveMeterNode.synchronizeProbePositions ) {

          // Align the probes each time the waveMeterNode translates, so they will stay in sync
          waveMeterNode.alignProbesEmitter.emit();
        }
      },
      drag: () => {
        if ( waveMeterNode.synchronizeProbePositions ) {

          // Align the probes each time the waveMeterNode translates, so they will stay in sync
          waveMeterNode.alignProbesEmitter.emit();
        }
      },
      end: () => {
        releaseSound.play();
        // Drop in toolbox, using the bounds of the entire waveMeterNode since it cannot be centered over the toolbox
        // (too close to the edge of the screen)
        if ( toolboxIntersects( waveMeterNode.getBackgroundNodeGlobalBounds() ) ) {
          waveMeterNode.reset();
          model.isWaveMeterInPlayAreaProperty.value = false;
        }

        // Move probes to center line (if water side view model)
        waveMeterNode.droppedEmitter.emit();
        waveMeterNode.synchronizeProbePositions = false;
      }
    } ) );

    const toolboxPanel = new ToolboxPanel( measuringTapeNode, stopwatchNode, waveMeterNode, alignGroup,
      model.isMeasuringTapeInPlayAreaProperty, model.measuringTapeTipPositionProperty,
      model.stopwatch.isVisibleProperty, model.isWaveMeterInPlayAreaProperty
    );
    const updateToolboxPosition = () => {
      toolboxPanel.mutate( {
        right: this.layoutBounds.right - MARGIN,
        top: MARGIN
      } );
    };
    updateToolboxPosition();

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
    toolboxPanel.boundsProperty.lazyLink( updateToolboxPosition );
    this.addChild( toolboxPanel );

    // @protected {WaveInterferenceControlPanel} for subtype layout
    this.controlPanel = new WaveInterferenceControlPanel( model, alignGroup, options.controlPanelOptions, {
      audioEnabled: options.audioEnabled
    } );

    const updateControlPanelPosition = () => {
      this.controlPanel.mutate( {
        right: this.layoutBounds.right - MARGIN,
        top: toolboxPanel.bottom + SPACING
      } );
    };
    updateControlPanelPosition();

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
    this.controlPanel.boundsProperty.lazyLink( updateControlPanelPosition );
    this.addChild( this.controlPanel );

    if ( options.showPulseContinuousRadioButtons ) {

      this.addChild( new SceneToggleNode(
        model,
        scene => new DisturbanceTypeRadioButtonGroup( scene.disturbanceTypeProperty ), {
          bottom: this.waveAreaNode.bottom,
          centerX: ( this.waveAreaNode.left + this.layoutBounds.left ) / 2
        } ) );
    }

    if ( options.showViewpointRadioButtonGroup ) {

      const OFFSET_TO_ALIGN_WITH_TIME_CONTROL_RADIO_BUTTONS = 1.8;
      this.addChild( new ViewpointRadioButtonGroup( model.viewpointProperty, {

        // Match size with TimeControlNode
        radioButtonOptions: {
          radius: new Text( 'test', {
            font: WaveInterferenceConstants.DEFAULT_FONT
          } ).height / 2
        },
        bottom: this.layoutBounds.bottom - MARGIN - OFFSET_TO_ALIGN_WITH_TIME_CONTROL_RADIO_BUTTONS,
        left: this.waveAreaNode.left
      } ) );
    }

    const timeControlNode = new TimeControlNode( model.isRunningProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      bottom: this.layoutBounds.bottom - MARGIN,
      left: this.waveAreaNode.centerX,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: WaveInterferenceConstants.DEFAULT_FONT,
          maxWidth: WaveInterferenceConstants.MAX_WIDTH_VIEWPORT_BUTTON_TEXT
        }
      },
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {

          // If we need to move forward further than one frame, call advanceTime several times rather than increasing the
          // dt, so the model will behave the same,
          // see https://github.com/phetsims/wave-interference/issues/254
          // and https://github.com/phetsims/wave-interference/issues/226
          listener: () => model.advanceTime( 1 / WavesModel.EVENT_RATE, true )
        }
      }
    } );

    // Center in the play area
    timeControlNode.center = new Vector2( this.waveAreaNode.centerX, timeControlNode.centerY );

    // @private
    this.stepAction = null;

    // Show the side of the water, when fully rotated and in WATER scene
    let waterSideViewNode = null;
    if ( model.waterScene ) {

      // Show a gray background for the water to make it easier to see the dotted line in the middle of the screen,
      // and visually partition the play area
      const waterGrayBackground = Rectangle.bounds( this.waveAreaNode.bounds, { fill: '#e2e3e5' } );
      this.addChild( waterGrayBackground );

      waterSideViewNode = new WaterSideViewNode( this.waveAreaNode.bounds, model.waterScene );
      Multilink.multilink( [ model.rotationAmountProperty, model.sceneProperty ], ( rotationAmount, scene ) => {
        waterSideViewNode.visible = rotationAmount === 1.0 && scene === model.waterScene;
        waterGrayBackground.visible = rotationAmount !== 0 && scene === model.waterScene;
      } );
      this.stepAction = new PhetioAction( () => waterDropLayer.step( waterSideViewNode ) );
    }

    // Update the visibility of the waveAreaNode, latticeNode and soundParticleLayer
    Multilink.multilink( [
        model.rotationAmountProperty,
        model.isRotatingProperty,
        model.sceneProperty,
        model.showWavesProperty,
        ...( model.soundScene ? [ model.soundScene.soundViewTypeProperty ] : [] )
      ],
      ( rotationAmount, isRotating, scene, showWaves, soundViewType ) => {
        const isWaterSideView = rotationAmount === 1 && scene === model.waterScene;
        const isVisiblePerspective = !isRotating && !isWaterSideView;
        this.waveAreaNode.visible = isVisiblePerspective;

        const showLattice = scene === model.soundScene ?
                            ( isVisiblePerspective &&
                              showWaves &&
                              soundViewType !== SoundScene.SoundViewType.PARTICLES
                            ) :
                            isVisiblePerspective;
        this.latticeNode.visible = showLattice;

        if ( soundParticleLayer ) {
          soundParticleLayer.visible = ( soundViewType === SoundScene.SoundViewType.PARTICLES ||
                                         soundViewType === SoundScene.SoundViewType.BOTH ) &&
                                       scene === model.soundScene && isVisiblePerspective;
        }
        if ( waterDropLayer ) {
          waterDropLayer.visible = scene === model.waterScene;
        }
      } );

    Multilink.multilink(
      [ model.rotationAmountProperty, model.isRotatingProperty, model.showGraphProperty ],
      ( rotationAmount, isRotating, showGraph ) => {
        waveAreaGraphNode.visible = !isRotating && showGraph;
        dashedLineNode.visible = !isRotating && showGraph;
      } );

    const perspective3DNode = new Perspective3DNode( this.waveAreaNode.bounds, model.rotationAmountProperty,
      model.isRotatingProperty );


    // Initialize and update the colors based on the scene
    const colorLinkProperties = [ model.sceneProperty ];
    if ( model.lightScene ) {
      colorLinkProperties.push( model.lightScene.frequencyProperty );
    }
    Multilink.multilink( colorLinkProperties, ( scene, frequency ) => {
      perspective3DNode.setTopFaceColor( scene === model.waterScene ? '#3981a9' :
                                         scene === model.soundScene ? 'gray' :
                                         VisibleColor.frequencyToColor( fromFemto( frequency ) ) );
      perspective3DNode.setSideFaceColor( scene === model.waterScene ? WaveInterferenceConstants.WATER_SIDE_COLOR :
                                          scene === model.soundScene ? 'darkGray' :
                                          VisibleColor.frequencyToColor( fromFemto( frequency ) )
                                            .colorUtilsDarker( 0.15 ) );
    } );

    /**
     * Creates a ToggleNode that shows the primary or secondary source
     * @param isPrimarySource - true if it should show the primary source
     */
    const createWaveGeneratorToggleNode = isPrimarySource => {
      const toggleNodeElements = [];
      model.waterScene && toggleNodeElements.push( {
        value: model.waterScene,
        createNode: () => new WaterWaveGeneratorNode( model.waterScene, this.waveAreaNode, isPrimarySource )
      } );

      model.soundScene && toggleNodeElements.push( {
        value: model.soundScene,
        createNode: () => new SoundWaveGeneratorNode( model.soundScene, this.waveAreaNode, isPrimarySource )
      } );

      model.lightScene && toggleNodeElements.push( {
        value: model.lightScene,
        createNode: () => new LightWaveGeneratorNode( model.lightScene, this.waveAreaNode, isPrimarySource )
      } );
      return new ToggleNode( model.sceneProperty, toggleNodeElements, {
        alignChildren: ToggleNode.NONE
      } );
    };

    this.addChild( perspective3DNode );

    if ( model.waterScene ) {
      this.addChild( waterDropLayer );
      this.addChild( waterSideViewNode );
    }
    if ( options.showSceneSpecificWaveGeneratorNodes ) {
      const primaryWaveGeneratorToggleNode = createWaveGeneratorToggleNode( true );
      this.addChild( primaryWaveGeneratorToggleNode ); // Primary source

      this.pdomPlayAreaNode.pdomOrder = [ primaryWaveGeneratorToggleNode, null ];

      // Secondary source
      if ( model.numberOfSources === 2 ) {
        this.addChild( createWaveGeneratorToggleNode( false ) );
      }
    }
    else {

      // @protected - placeholder for alternative wave generator nodes
      this.waveGeneratorLayer = new Node();
      this.addChild( this.waveGeneratorLayer );
    }
    this.addChild( timeControlNode );
    this.addChild( resetAllButton );
    soundParticleLayer && this.addChild( soundParticleLayer );
    this.addChild( dashedLineNode );
    this.addChild( this.afterWaveAreaNode );
    this.addChild( waveAreaGraphNode );
    this.addChild( measuringTapeNode );
    this.addChild( stopwatchNode );
    this.addChild( waveMeterNode );

    // Only start up the audio system if sound is enabled for this screen
    if ( options.audioEnabled ) {

      // @private
      this.wavesScreenSoundView = new WavesScreenSoundView( model, this, options );
    }
  }

  public globalToLatticeCoordinate( point: Vector2 ): Vector2 {
    const latticeNode = this.sceneToNode( this.model.sceneProperty.value );

    const localPoint = latticeNode.globalToLocalPoint( point );
    return LatticeCanvasNode.localPointToLatticePoint( localPoint );
  }

  /**
   * Notify listeners of the step phase.
   */
  public step( dt: number ): void {
    this.stepAction && this.stepAction.execute();
  }
}

/**
 * @static
 * @public
 */
WavesScreenView.SPACING = SPACING;

waveInterference.register( 'WavesScreenView', WavesScreenView );
export default WavesScreenView;
