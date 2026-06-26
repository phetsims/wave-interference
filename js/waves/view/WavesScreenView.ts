// Copyright 2018-2026, University of Colorado Boulder

/**
 * View for the "Waves" screen.  Extended for the Interference and Slits screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import BoundaryReachedSoundPlayer from '../../../../tambo/js/BoundaryReachedSoundPlayer.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Utils from '../../../../scenery/js/util/Utils.js';
import ToggleNode, { ToggleNodeElement } from '../../../../sun/js/ToggleNode.js';
import PhetioAction from '../../../../tandem/js/PhetioAction.js';
import Scene from '../../common/model/Scene.js';
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
import { addBoundaryReachedSound, isPointOnBoundary } from '../../common/view/WaveInterferenceBoundarySound.js';
import ViewpointRadioButtonGroup from '../../common/view/ViewpointRadioButtonGroup.js';
import WaterDropLayer from '../../common/view/WaterDropLayer.js';
import WaterSideViewNode from '../../common/view/WaterSideViewNode.js';
import WaterWaveGeneratorNode from '../../common/view/WaterWaveGeneratorNode.js';
import WaveAreaGraphNode from '../../common/view/WaveAreaGraphNode.js';
import WaveAreaNode from '../../common/view/WaveAreaNode.js';
import WaveInterferenceControlPanel, { WaveInterferenceControlPanelOptions } from '../../common/view/WaveInterferenceControlPanel.js';
import WaveInterferenceStopwatchNode from '../../common/view/WaveInterferenceStopwatchNode.js';
import WaveMeterNode from '../../common/view/WaveMeterNode.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../../common/WaveInterferenceUtils.js';
import WavesModel from '../model/WavesModel.js';
import WavesScreenSoundView from './WavesScreenSoundView.js';

// constants
const MARGIN = WaveInterferenceConstants.MARGIN;
const SPACING = 6;
const WAVE_MARGIN = 8; // Additional margin shown around the wave lattice
const WATER_BLUE = WaveInterferenceConstants.WATER_SIDE_COLOR;
const fromFemto = WaveInterferenceUtils.fromFemto;

type SelfOptions = {

  // Only allow side view in single source/no slits context
  showViewpointRadioButtonGroup?: boolean;

  // Allow the user to choose between pulse and continuous.
  showPulseContinuousRadioButtons?: boolean;

  // If true, Nodes will be added that show each wave generator, otherwise none are shown.
  showSceneSpecificWaveGeneratorNodes?: boolean;

  // Scale factor for the brightness on the LightScreenNode,
  // see https://github.com/phetsims/wave-interference/issues/161
  piecewiseLinearBrightness?: boolean;

  lightScreenAveragingWindowSize?: number;

  // Nested options as discussed in https://github.com/phetsims/tasks/issues/730,
  // see WaveInterferenceControlPanel for keys/values.
  controlPanelOptions?: WaveInterferenceControlPanelOptions;

  audioEnabled?: boolean;
};

// ScreenView is not yet converted to TypeScript with options support, so its options type is not composed here.
export type WavesScreenViewOptions = SelfOptions;

class WavesScreenView extends ScreenView {

  private readonly model: WavesModel;

  // shows the background of the wave area for sound view and used for layout
  public readonly waveAreaNode: WaveAreaNode;

  // placeholder for z-ordering for subclasses
  protected readonly afterWaveAreaNode: Node;

  // for subtype layout
  protected readonly controlPanel: WaveInterferenceControlPanel;

  // placeholder for alternative wave generator nodes, only created when showSceneSpecificWaveGeneratorNodes is false
  protected waveGeneratorLayer?: Node;

  // canvas that renders the water lattice, only created when the model has a waterScene
  private waterCanvasNode?: LatticeCanvasNode;

  // canvas that renders the sound lattice, only created when the model has a soundScene
  private soundCanvasNode?: LatticeCanvasNode;

  // canvas that renders the light lattice, only created when the model has a lightScene
  private lightCanvasNode?: LatticeCanvasNode;

  // maps a scene to the LatticeCanvasNode that renders it
  private readonly sceneToNode: ( scene: Scene ) => LatticeCanvasNode;

  // toggles between the lattice canvas nodes for the different scenes
  private readonly latticeNode: SceneToggleNode;

  // the WaveMeterNode tool. Public because WavesScreenSoundView reads its duckingProperty.
  public readonly waveMeterNode: WaveMeterNode;

  // Nodes captured for building the traversal (pdom) order. See updateTraversalOrder().
  // The wave source on/off control(s); empty for the Slits screen, which injects its plane-wave generator into
  // additionalPlayAreaNodes instead.
  private readonly waveGeneratorNodes: Node[] = [];

  // The pulse/continuous radio buttons, or null when not shown on this screen.
  private readonly disturbanceTypeNode: Node | null;

  // The top-view/side-view radio buttons, or null when not shown on this screen.
  private readonly viewpointRadioButtonGroup: Node | null;

  private readonly timeControlNode: TimeControlNode;
  private readonly toolboxPanel: ToolboxPanel;
  private readonly measuringTapeNode: MeasuringTapeNode;
  private readonly stopwatchNode: WaveInterferenceStopwatchNode;
  private readonly resetAllButton: ResetAllButton;

  // Subclass hooks for the traversal order: extra play-area nodes (e.g. the Slits plane-wave generator) are placed
  // right after the wave source, and extra control-area panels (e.g. the Slits control panel) right after the main
  // control panel. Subclasses push to these and then call updateTraversalOrder().
  protected readonly additionalPlayAreaNodes: Node[] = [];
  protected readonly additionalControlAreaNodes: Node[] = [];

  // executed once per step, or null if there is no per-step behavior (e.g. when there is no waterScene)
  private stepAction: PhetioAction | null;

  // only created when audio is enabled for this screen
  private wavesScreenSoundView?: WavesScreenSoundView;

  public static readonly SPACING = SPACING;

  /**
   * @param model
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   * @param [providedOptions]
   */
  public constructor( model: WavesModel, alignGroup: AlignGroup, providedOptions?: WavesScreenViewOptions ) {

    const options = optionize<WavesScreenViewOptions, SelfOptions>()( {

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
    }, providedOptions );
    super();

    this.model = model;

    // shows the background of the wave area for sound view and used for layout
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

    // placeholder for z-ordering for subclasses
    this.afterWaveAreaNode = new Node();

    // show the length scale at the top left of the wave area
    const lengthScaleIndicatorNode = new SceneToggleNode(
      model,
      scene => new LengthScaleIndicatorNode( scene.scaleIndicatorLength * this.waveAreaNode.width / scene.waveAreaWidth, scene.scaleIndicatorTextProperty ), {
        alignChildren: ToggleNode.LEFT,
        bottom: this.waveAreaNode.top - 2,
        left: this.waveAreaNode.left
      } );
    this.addChild( lengthScaleIndicatorNode );

    // show the time scale at the top right of the wave area
    const timeScaleIndicatorNode = new SceneToggleNode(
      model,
      scene => new RichText( scene.timeScaleStringProperty, { font: WaveInterferenceConstants.TIME_AND_LENGTH_SCALE_INDICATOR_FONT } ), {
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
    this.resetAllButton = resetAllButton;

    // Create the canvases to render the lattices

    let waterDropLayer: WaterDropLayer | null = null;
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
      // LatticeCanvasNode declares its options parameter as required, so an empty options object is supplied.
      this.lightCanvasNode = new LatticeCanvasNode( model.lightScene.lattice, {} );
    }

    this.sceneToNode = scene => scene === model.waterScene ? this.waterCanvasNode! :
                                scene === model.soundScene ? this.soundCanvasNode! :
                                this.lightCanvasNode!;
    this.latticeNode = new SceneToggleNode( model, this.sceneToNode );
    model.showWavesProperty.linkAttribute( this.latticeNode, 'visible' );

    const latticeScale = this.waveAreaNode.width / this.latticeNode.width;
    this.latticeNode.mutate( {
      scale: latticeScale,
      center: this.waveAreaNode.center
    } );

    let lightScreenNode: LightScreenNode | null = null;

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
        lightScreenNode!.visible = showScreen && scene === model.lightScene;
      } );

      // Set the color of highlight on the screen and lattice
      model.lightScene.frequencyProperty.link( lightFrequency => {
        const baseColor = VisibleColor.frequencyToColor( fromFemto( lightFrequency ) );
        this.lightCanvasNode!.setBaseColor( baseColor );
        this.lightCanvasNode!.vacuumColor = Color.black;
        lightScreenNode!.setBaseColor( baseColor );
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
          left: lightScreenNode!.right + 5
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
    const getMeasuringTapeValue = ( scene: Scene ) => {
      return {
        name: scene.translatedPositionUnitsProperty.value,

        // The measuring tape tip and tail are in the view coordinate frame, this scale factor converts to model
        // coordinates according to the scene
        multiplier: scene.waveAreaWidth / this.waveAreaNode.width
      };
    };

    const measuringTapeUnitsProperty = new Property( getMeasuringTapeValue( model.sceneProperty.value ) );

    // Recompute on scene change AND on locale change (each scene's translated units Property), so the units stay live.
    // Multiple scenes can share the same units Property instance (e.g. water and sound both use centimeters), so
    // link to the unique set of Properties to avoid adding the same listener twice.
    const updateMeasuringTapeUnits = () => measuringTapeUnitsProperty.set( getMeasuringTapeValue( model.sceneProperty.value ) );
    model.sceneProperty.link( updateMeasuringTapeUnits );
    _.uniq( model.scenes.map( scene => scene.translatedPositionUnitsProperty ) ).forEach(
      unitsProperty => unitsProperty.link( updateMeasuringTapeUnits ) );

    /**
     * Checks if the toolbox intersects the given bounds, to see if a tool can be dropped back into the toolbox.
     */
    const toolboxIntersects = ( b: Bounds2 ) => toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds ).intersectsBounds( b );

    const measuringTapeNode = new MeasuringTapeNode( measuringTapeUnitsProperty, {

      // translucent white background, same value as in Projectile Motion, see https://github.com/phetsims/projectile-motion/issues/156
      textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )',
      textColor: 'black',
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,

      // Drop in toolbox
      baseDragEnded: () => {
        if ( toolboxIntersects( measuringTapeNode.localToGlobalBounds( measuringTapeNode.getLocalBaseBounds() ) ) ) {
          model.isMeasuringTapeInPlayAreaProperty.value = false;

          // Reset the rotation and length of the Measuring Tape when it is returned to the toolbox.
          model.measuringTapeBasePositionProperty.reset();
          model.measuringTapeTipPositionProperty.reset();
        }
      }
    } );
    this.visibleBoundsProperty.link( visibleBounds => measuringTapeNode.setDragBounds( visibleBounds.eroded( 20 ) ) );
    model.isMeasuringTapeInPlayAreaProperty.linkAttribute( measuringTapeNode, 'visible' );
    this.measuringTapeNode = measuringTapeNode;

    // Boundary-reached sound when the measuring tape base or tip is dragged to the edge of its drag bounds (the same
    // visibleBounds.eroded( 20 ) the MeasuringTapeNode clamps to). Gated by the user-controlled Properties so the
    // sound only plays while that handle is being dragged, not when the tape is reset or re-clamped on layout changes.
    const measuringTapeBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => visibleBounds.eroded( 20 ) );
    addBoundaryReachedSound( model.measuringTapeBasePositionProperty,
      () => isPointOnBoundary( model.measuringTapeBasePositionProperty.value, measuringTapeBoundsProperty.value ),
      measuringTapeNode.isBaseUserControlledProperty );
    addBoundaryReachedSound( model.measuringTapeTipPositionProperty,
      () => isPointOnBoundary( model.measuringTapeTipPositionProperty.value, measuringTapeBoundsProperty.value ),
      measuringTapeNode.isTipUserControlledProperty );

    const stopwatchNode = new WaveInterferenceStopwatchNode( model, {
      dragBoundsProperty: this.visibleBoundsProperty,

      dragListenerOptions: {
        end: () => {
          if ( toolboxIntersects( stopwatchNode.parentToGlobalBounds( stopwatchNode.bounds ) ) ) {
            model.stopwatch.reset();
          }
        }
      }
    } );
    this.stopwatchNode = stopwatchNode;

    // Boundary-reached sound when the stopwatch is dragged (pointer or keyboard) so its node abuts an edge of the
    // visible bounds. The StopwatchNode constrains the whole node, so the position is clamped to the visible bounds
    // inset by the node's extent. We replicate that inset from localBounds (which is unaffected by the node's
    // translation) rather than reading the live node bounds, which would force a bounds validation mid-drag and
    // re-enter the StopwatchNode's own re-clamp. Gated by the drag listeners so reset/layout re-clamps don't bonk.
    const stopwatchDraggingProperty = new DerivedProperty(
      [ stopwatchNode.dragListener!.isPressedProperty, stopwatchNode.keyboardDragListener!.isPressedProperty ],
      ( pointerDragging, keyboardDragging ) => pointerDragging || keyboardDragging );
    const stopwatchPositionBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, stopwatchNode.localBoundsProperty ],
      ( dragBounds, localBounds ) => new Bounds2(
        dragBounds.minX - localBounds.minX, dragBounds.minY - localBounds.minY,
        dragBounds.maxX - localBounds.maxX, dragBounds.maxY - localBounds.maxY
      ) );
    addBoundaryReachedSound( model.stopwatch.positionProperty,
      () => isPointOnBoundary( model.stopwatch.positionProperty.value, stopwatchPositionBoundsProperty.value ),
      stopwatchDraggingProperty );

    const waveMeterNode: WaveMeterNode = new WaveMeterNode( model, this );
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

    // Boundary-reached sound when the chart body is dragged (pointer or keyboard) to the edge of its drag bounds. The
    // body is translated by the listeners, so its translation is the clamped position. Shared by both listeners.
    const waveMeterBodyBoundaryReachedSoundPlayer = new BoundaryReachedSoundPlayer();
    const updateWaveMeterBodyBoundarySound = () => waveMeterBodyBoundaryReachedSoundPlayer.setOnBoundary(
      isPointOnBoundary( waveMeterNode.backgroundNode.translation, waveMeterBoundsProperty.value ) );

    waveMeterNode.setDragListener( new SoundDragListener( {
      dragBoundsProperty: waveMeterBoundsProperty,
      translateNode: true,
      start: () => {
        waveMeterBodyBoundaryReachedSoundPlayer.setOnBoundary( false );
        waveMeterNode.moveToFront();
        if ( waveMeterNode.synchronizeProbePositions ) {

          // Align the probes each time the waveMeterNode translates, so they will stay in sync
          waveMeterNode.alignProbesEmitter.emit();
        }
      },
      drag: () => {
        updateWaveMeterBodyBoundarySound();
        if ( waveMeterNode.synchronizeProbePositions ) {

          // Align the probes each time the waveMeterNode translates, so they will stay in sync
          waveMeterNode.alignProbesEmitter.emit();
        }
      },
      end: () => {

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

    // Keyboard dragging for the wave meter chart body. The body is made focusable in WaveMeterNode via
    // AccessibleDraggableOptions; the drag bounds are computed here, so the keyboard listener is installed here too.
    waveMeterNode.backgroundNode.addInputListener( new SoundKeyboardDragListener( {
      translateNode: true,
      dragBoundsProperty: waveMeterBoundsProperty,
      start: () => {
        waveMeterBodyBoundaryReachedSoundPlayer.setOnBoundary( false );
        waveMeterNode.moveToFront();
      },
      drag: () => {
        updateWaveMeterBodyBoundarySound();
        if ( waveMeterNode.synchronizeProbePositions ) {
          waveMeterNode.alignProbesEmitter.emit();
        }
      }
    } ) );

    const toolboxPanel = new ToolboxPanel( measuringTapeNode, stopwatchNode, waveMeterNode, alignGroup,
      model.isMeasuringTapeInPlayAreaProperty, model.measuringTapeTipPositionProperty,
      model.stopwatch, model.isWaveMeterInPlayAreaProperty
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
    this.toolboxPanel = toolboxPanel;

    // for subtype layout

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

    // Captured for the traversal (pdom) order; null when not shown on this screen.
    let disturbanceTypeNode: Node | null = null;
    if ( options.showPulseContinuousRadioButtons ) {

      disturbanceTypeNode = new SceneToggleNode(
        model,

        scene => new DisturbanceTypeRadioButtonGroup( scene.disturbanceTypeProperty ), {
          bottom: this.waveAreaNode.bottom,
          centerX: ( this.waveAreaNode.left + this.layoutBounds.left ) / 2
        } );
      this.addChild( disturbanceTypeNode );
    }
    this.disturbanceTypeNode = disturbanceTypeNode;

    // Captured for the traversal (pdom) order; null when not shown on this screen.
    let viewpointRadioButtonGroup: ViewpointRadioButtonGroup | null = null;
    if ( options.showViewpointRadioButtonGroup ) {

      const OFFSET_TO_ALIGN_WITH_TIME_CONTROL_RADIO_BUTTONS = 1.8;
      viewpointRadioButtonGroup = new ViewpointRadioButtonGroup( model.viewpointProperty, {

        // Match size with TimeControlNode
        radioButtonOptions: {
          radius: new Text( 'test', {
            font: WaveInterferenceConstants.DEFAULT_FONT
          } ).height / 2
        },
        bottom: this.layoutBounds.bottom - MARGIN - OFFSET_TO_ALIGN_WITH_TIME_CONTROL_RADIO_BUTTONS,
        left: this.waveAreaNode.left
      } );
      this.addChild( viewpointRadioButtonGroup );
    }
    this.viewpointRadioButtonGroup = viewpointRadioButtonGroup;

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
    this.timeControlNode = timeControlNode;

    this.stepAction = null;

    // Show the side of the water, when fully rotated and in WATER scene
    let waterSideViewNode: WaterSideViewNode | null = null;
    if ( model.waterScene ) {

      // Show a gray background for the water to make it easier to see the dotted line in the middle of the screen,
      // and visually partition the play area
      const waterGrayBackground = Rectangle.bounds( this.waveAreaNode.bounds, { fill: '#e2e3e5' } );
      this.addChild( waterGrayBackground );

      waterSideViewNode = new WaterSideViewNode( this.waveAreaNode.bounds, model.waterScene );
      Multilink.multilink( [ model.rotationAmountProperty, model.sceneProperty ], ( rotationAmount, scene ) => {
        waterSideViewNode!.visible = rotationAmount === 1.0 && scene === model.waterScene;
        waterGrayBackground.visible = rotationAmount !== 0 && scene === model.waterScene;
      } );
      this.stepAction = new PhetioAction( () => waterDropLayer!.step( waterSideViewNode! ) );
    }

    // Update the visibility of the waveAreaNode, latticeNode and soundParticleLayer.
    // The dependency array is built conditionally with a spread, so multilinkAny is used to accept a variable-length
    // dependency array.
    Multilink.multilinkAny( [
        model.rotationAmountProperty,
        model.isRotatingProperty,
        model.sceneProperty,
        model.showWavesProperty,
        ...( model.soundScene ? [ model.soundScene.soundViewTypeProperty ] : [] )
      ],
      () => {
        const rotationAmount = model.rotationAmountProperty.value;
        const isRotating = model.isRotatingProperty.value;
        const scene = model.sceneProperty.value;
        const showWaves = model.showWavesProperty.value;
        const soundViewType = model.soundScene?.soundViewTypeProperty.value;
        const isWaterSideView = rotationAmount === 1 && scene === model.waterScene;
        const isVisiblePerspective = !isRotating && !isWaterSideView;
        this.waveAreaNode.visible = isVisiblePerspective;

        const showLattice = scene === model.soundScene ?
                            ( isVisiblePerspective &&
                              showWaves &&

                              soundViewType !== 'particles'
                            ) :
                            isVisiblePerspective;
        this.latticeNode.visible = showLattice;

        if ( soundParticleLayer ) {

          soundParticleLayer.visible = ( soundViewType === 'particles' ||
                                         soundViewType === 'both' ) &&
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


    // Initialize and update the colors based on the scene. The frequencyProperty is conditionally added, so the
    // dependency array is heterogeneous and does not match a fixed-length Multilink overload.
    const colorLinkProperties: TReadOnlyProperty<unknown>[] = [ model.sceneProperty ];
    if ( model.lightScene ) {
      colorLinkProperties.push( model.lightScene.frequencyProperty );
    }

    Multilink.multilinkAny( colorLinkProperties, () => {
      const scene = model.sceneProperty.value;
      const frequency = model.lightScene ? model.lightScene.frequencyProperty.value : 0;

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
    const createWaveGeneratorToggleNode = ( isPrimarySource: boolean ) => {
      const toggleNodeElements: ToggleNodeElement<Scene>[] = [];
      model.waterScene && toggleNodeElements.push( {
        value: model.waterScene,
        createNode: () => new WaterWaveGeneratorNode( model.waterScene!, this.waveAreaNode, isPrimarySource )
      } );

      model.soundScene && toggleNodeElements.push( {
        value: model.soundScene,
        createNode: () => new SoundWaveGeneratorNode( model.soundScene!, this.waveAreaNode, isPrimarySource )
      } );

      model.lightScene && toggleNodeElements.push( {
        value: model.lightScene,
        createNode: () => new LightWaveGeneratorNode( model.lightScene!, this.waveAreaNode, isPrimarySource )
      } );
      return new ToggleNode( model.sceneProperty, toggleNodeElements, {
        alignChildren: ToggleNode.NONE
      } );
    };

    this.addChild( perspective3DNode );

    if ( model.waterScene ) {
      this.addChild( waterDropLayer! );
      this.addChild( waterSideViewNode! );
    }
    if ( options.showSceneSpecificWaveGeneratorNodes ) {
      const primaryWaveGeneratorToggleNode = createWaveGeneratorToggleNode( true );
      this.addChild( primaryWaveGeneratorToggleNode ); // Primary source
      this.waveGeneratorNodes.push( primaryWaveGeneratorToggleNode );

      // Secondary source
      if ( model.numberOfSources === 2 ) {
        const secondaryWaveGeneratorToggleNode = createWaveGeneratorToggleNode( false );
        this.addChild( secondaryWaveGeneratorToggleNode );
        this.waveGeneratorNodes.push( secondaryWaveGeneratorToggleNode );
      }
    }
    else {

      // placeholder for alternative wave generator nodes
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

    // Establish the keyboard traversal order. Subclasses that add interactive nodes (e.g. Slits) push to the
    // additional* arrays and call this again.
    this.updateTraversalOrder();

    // Only start up the audio system if sound is enabled for this screen
    if ( options.audioEnabled ) {
      this.wavesScreenSoundView = new WavesScreenSoundView( model, this, options );
    }
  }

  /**
   * Sets the keyboard traversal (pdom) order for the play area and the control area. The play area runs from the wave
   * source through the deployed tools (measuring tape, stopwatch, wave meter, which are last); the control area holds
   * the toolbox launcher and control panel(s) and ends with the Reset All button. This is safe to call multiple times,
   * so subclasses can augment additionalPlayAreaNodes / additionalControlAreaNodes and call it again to fold in their
   * own interactive content.
   */
  protected updateTraversalOrder(): void {

    this.pdomPlayAreaNode.pdomOrder = [
      ...this.waveGeneratorNodes,
      ...this.additionalPlayAreaNodes,
      this.disturbanceTypeNode,
      this.viewpointRadioButtonGroup,
      this.timeControlNode,

      // The real (deployed) tools are the last things in the play area, in this order. The toolbox launcher panel
      // lives in the control area below.
      this.measuringTapeNode,
      this.stopwatchNode,
      this.waveMeterNode
    ].filter( ( node ): node is Node => node !== null );

    this.pdomControlAreaNode.pdomOrder = [
      this.toolboxPanel,
      this.controlPanel,
      ...this.additionalControlAreaNodes,
      this.resetAllButton
    ];
  }

  public globalToLatticeCoordinate( point: Vector2 ): Vector2 {
    const latticeNode = this.sceneToNode( this.model.sceneProperty.value );

    const localPoint = latticeNode.globalToLocalPoint( point );
    return LatticeCanvasNode.localPointToLatticePoint( localPoint );
  }

  /**
   * Notify listeners of the step phase.
   */
  public override step( dt: number ): void {
    this.stepAction && this.stepAction.execute();
  }
}

export default WavesScreenView;
