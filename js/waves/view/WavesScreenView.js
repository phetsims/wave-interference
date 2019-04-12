// Copyright 2018-2019, University of Colorado Boulder

/**
 * View for the "Waves" screen.  Extended for the Interference and Slits screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Action = require( 'AXON/Action' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const DashedLineNode = require( 'WAVE_INTERFERENCE/common/view/DashedLineNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DisturbanceTypeRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/DisturbanceTypeRadioButtonGroup' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Emitter = require( 'AXON/Emitter' );
  const IntensityGraphPanel = require( 'WAVE_INTERFERENCE/common/view/IntensityGraphPanel' );
  const LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  const LengthScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/LengthScaleIndicatorNode' );
  const LightScreenNode = require( 'WAVE_INTERFERENCE/common/view/LightScreenNode' );
  const LightWaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/LightWaveGeneratorNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Perspective3DNode = require( 'WAVE_INTERFERENCE/common/view/Perspective3DNode' );
  const platform = require( 'PHET_CORE/platform' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Shape = require( 'KITE/Shape' );
  const SoundParticleCanvasLayer = require( 'WAVE_INTERFERENCE/common/view/SoundParticleCanvasLayer' );
  const SoundParticleImageLayer = require( 'WAVE_INTERFERENCE/common/view/SoundParticleImageLayer' );
  const SoundScene = require( 'WAVE_INTERFERENCE/common/model/SoundScene' );
  const SoundWaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/SoundWaveGeneratorNode' );
  const TimeControls = require( 'WAVE_INTERFERENCE/common/view/TimeControls' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const ToolboxPanel = require( 'WAVE_INTERFERENCE/common/view/ToolboxPanel' );
  const Util = require( 'SCENERY/util/Util' );
  const ViewpointRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/ViewpointRadioButtonGroup' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const WaterDropLayer = require( 'WAVE_INTERFERENCE/common/view/WaterDropLayer' );
  const WaterSideViewNode = require( 'WAVE_INTERFERENCE/common/view/WaterSideViewNode' );
  const WaterWaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/WaterWaveGeneratorNode' );
  const WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaGraphNode' );
  const WaveAreaNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceControlPanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceControlPanel' );
  const WaveInterferenceTimerNode = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceTimerNode' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );
  const WaveMeterNode = require( 'WAVE_INTERFERENCE/common/view/WaveMeterNode' );

  // constants
  const MARGIN = 8;
  const SPACING = 6;
  const WAVE_MARGIN = 8; // Additional margin shown around the wave lattice
  const WATER_BLUE = WaveInterferenceConstants.WATER_SIDE_COLOR;
  const fromFemto = WaveInterferenceUtils.fromFemto;

  class WavesScreenView extends ScreenView {

    /**
     * @param {WavesModel} model
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     * @param {Object} [options]
     */
    constructor( model, alignGroup, options ) {

      options = _.extend( {

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
        controlPanelOptions: {}
      }, options );
      super();

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
      this.addChild( resetAllButton );

      // Create the canvases to render the lattices
      this.waterCanvasNode = new LatticeCanvasNode( model.waterScene.lattice, { baseColor: WATER_BLUE } );
      this.soundCanvasNode = new LatticeCanvasNode( model.soundScene.lattice, { baseColor: Color.white } );
      this.lightCanvasNode = new LatticeCanvasNode( model.lightScene.lattice );
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

      const lightScreenNode = new LightScreenNode( model.lightScene.lattice, model.lightScene.intensitySample, {
        piecewiseLinearBrightness: options.piecewiseLinearBrightness,
        lightScreenAveragingWindowSize: options.lightScreenAveragingWindowSize,
        scale: latticeScale,
        left: this.waveAreaNode.right + 5,
        y: this.waveAreaNode.top
      } );

      // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
      Property.multilink( [ model.showScreenProperty, model.sceneProperty ], ( showScreen, scene ) => {
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
      this.addChild( this.latticeNode );
      this.addChild( borderNode );

      // Match the size of the scale indicator
      const numberGridLines = model.lightScene.waveAreaWidth / model.lightScene.scaleIndicatorLength;
      const intensityGraphPanel = new IntensityGraphPanel(
        this.latticeNode.height,
        model.lightScene.intensitySample,
        numberGridLines,
        model.resetEmitter, {
          left: lightScreenNode.right + 5
        } );
      Property.multilink( [ model.showScreenProperty, model.showIntensityGraphProperty, model.sceneProperty ],
        ( showScreen, showIntensityGraph, scene ) => {

          // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
          intensityGraphPanel.visible = showScreen && showIntensityGraph && scene === model.lightScene;
        } );
      this.addChild( intensityGraphPanel );

      // Make sure the charting area is perfectly aligned with the wave area
      intensityGraphPanel.translate(
        0, this.latticeNode.globalBounds.top - intensityGraphPanel.getChartGlobalBounds().top
      );

      /**
       * Return the measuring tape Property value for the specified scene.  See MeasuringTapeNode constructor docs.
       * @param {Scene} scene
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
       * @param {Bounds2} b
       * @returns {boolean}
       */
      const toolboxIntersects = b => toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds ).intersectsBounds( b );

      const measuringTapeNode = new MeasuringTapeNode( measuringTapeProperty, new BooleanProperty( true ), {

        // translucent white background, same value as in Projectile Motion, see https://github.com/phetsims/projectile-motion/issues/156
        textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )',
        textColor: 'black',
        basePositionProperty: model.measuringTapeBasePositionProperty,
        tipPositionProperty: model.measuringTapeTipPositionProperty,
        dragBounds: this.visibleBoundsProperty.value,

        // Drop in toolbox
        baseDragEnded: () => {
          if ( toolboxIntersects( measuringTapeNode.localToGlobalBounds( measuringTapeNode.baseImage.bounds ) ) ) {
            model.isMeasuringTapeInPlayAreaProperty.value = false;

            // Reset the rotation and length of the Measuring Tape when it is returned to the toolbox.
            measuringTapeNode.reset();
          }
        }
      } );
      this.visibleBoundsProperty.link( visibleBounds => measuringTapeNode.setDragBounds( visibleBounds ) );
      model.isMeasuringTapeInPlayAreaProperty.linkAttribute( measuringTapeNode, 'visible' );

      const timerNode = new WaveInterferenceTimerNode( model, {
        visibleBoundsProperty: this.visibleBoundsProperty,

        // Drop in toolbox
        end: () => {
          if ( toolboxIntersects( timerNode.parentToGlobalBounds( timerNode.bounds ) ) ) {
            model.isTimerInPlayAreaProperty.value = false;
            model.timerElapsedTimeProperty.value = 0;
            model.isTimerRunningProperty.value = false;
          }
        }
      } );

      const waveMeterNode = new WaveMeterNode( model, this );
      model.resetEmitter.addListener( () => waveMeterNode.alignProbesEmitter.emit() );
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
      waveMeterNode.setDragListener( new DragListener( {
        dragBoundsProperty: waveMeterBoundsProperty,
        translateNode: true,
        start: () => {
          if ( waveMeterNode.synchronizeProbeLocations ) {

            // Align the probes each time the MeterBodyNode translates, so they will stay in sync
            waveMeterNode.alignProbesEmitter.emit();
          }
        },
        drag: () => {

          if ( waveMeterNode.synchronizeProbeLocations ) {

            // Align the probes each time the MeterBodyNode translates, so they will stay in sync
            waveMeterNode.alignProbesEmitter.emit();
          }
        },
        end: () => {

          // Drop in toolbox, using the bounds of the entire waveMeterNode since it cannot be centered over the toolbox
          // (too close to the edge of the screen)
          if ( toolboxIntersects( waveMeterNode.getBackgroundNodeGlobalBounds() ) ) {
            waveMeterNode.alignProbesEmitter.emit();
            model.isWaveMeterInPlayAreaProperty.value = false;
          }

          // Move probes to center line (if water side view model)
          waveMeterNode.droppedEmitter.emit();
          waveMeterNode.synchronizeProbeLocations = false;
        }
      } ) );

      const toolboxPanel = new ToolboxPanel( measuringTapeNode, timerNode, waveMeterNode, alignGroup,
        model.isMeasuringTapeInPlayAreaProperty, model.measuringTapeTipPositionProperty,
        model.isTimerInPlayAreaProperty, model.isWaveMeterInPlayAreaProperty
      );
      const updateToolboxPosition = () => {
        toolboxPanel.mutate( {
          right: this.layoutBounds.right - MARGIN,
          top: MARGIN
        } );
      };
      updateToolboxPosition();

      // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
      toolboxPanel.on( 'bounds', updateToolboxPosition );
      this.addChild( toolboxPanel );

      // @protected {WaveInterferenceControlPanel} for subtype layout
      this.controlPanel = new WaveInterferenceControlPanel( model, alignGroup, options.controlPanelOptions );

      const updateControlPanelPosition = () => {
        this.controlPanel.mutate( {
          right: this.layoutBounds.right - MARGIN,
          top: toolboxPanel.bottom + SPACING
        } );
      };
      updateControlPanelPosition();

      // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
      this.controlPanel.on( 'bounds', updateControlPanelPosition );
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
        this.addChild( new ViewpointRadioButtonGroup( model.viewpointProperty, {
          bottom: this.layoutBounds.bottom - MARGIN,
          left: this.waveAreaNode.left
        } ) );
      }

      const timeControls = new TimeControls( model, {
        bottom: this.layoutBounds.bottom - MARGIN,
        centerX: this.waveAreaNode.centerX
      } );

      // Show a gray background for the water to make it easier to see the dotted line in the middle of the screen,
      // and visually partition the play area
      const waterGrayBackground = Rectangle.bounds( this.waveAreaNode.bounds, { fill: '#e2e3e5' } );
      this.addChild( waterGrayBackground );

      // Show the side of the water, when fully rotated and in WATER scene
      const waterSideViewNode = new WaterSideViewNode( this.waveAreaNode.bounds, model.waterScene );
      Property.multilink( [ model.rotationAmountProperty, model.sceneProperty ], ( rotationAmount, scene ) => {
        waterSideViewNode.visible = rotationAmount === 1.0 && scene === model.waterScene;
        waterGrayBackground.visible = rotationAmount !== 0 && scene === model.waterScene;
      } );

      // @public
      this.steppedEmitter = new Action( () => waterDropLayer.step( waterSideViewNode ) );

      const createSoundParticleLayer = () => {

        // Too much garbage on firefox, so only opt in to WebGL for mobile safari (where it is needed most)
        // and where the garbage doesn't seem to slow it down much.
        const useWebgl = phet.chipper.queryParameters.webgl && platform.mobileSafari && Util.isWebGLSupported;
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
      const soundParticleLayer = model.soundScene.showSoundParticles ? createSoundParticleLayer() : new Node();

      const waterDropLayer = new WaterDropLayer( model, this.waveAreaNode.bounds );

      // Update the visibility of the waveAreaNode, latticeNode and soundParticleLayer
      Property.multilink(
        [ model.rotationAmountProperty, model.isRotatingProperty, model.sceneProperty, model.showWavesProperty,
          model.soundScene.soundViewTypeProperty ],
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

          soundParticleLayer.visible = ( soundViewType === SoundScene.SoundViewType.PARTICLES ||
                                         soundViewType === SoundScene.SoundViewType.BOTH ) &&
                                       scene === model.soundScene && isVisiblePerspective;

          waterDropLayer.visible = scene === model.waterScene;
        } );

      Property.multilink(
        [ model.rotationAmountProperty, model.isRotatingProperty, model.showGraphProperty ],
        ( rotationAmount, isRotating, showGraph ) => {
          waveAreaGraphNode.visible = !isRotating && showGraph;
          dashedLineNode.visible = !isRotating && showGraph;
        } );

      const perspective3DNode = new Perspective3DNode( this.waveAreaNode.bounds, model.rotationAmountProperty,
        model.isRotatingProperty );

      // Initialize and update the colors based on the scene
      Property.multilink( [ model.sceneProperty, model.lightScene.frequencyProperty ], ( scene, frequency ) => {
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
       * @param {boolean} isPrimarySource - true if it should show the primary source
       */
      const createWaveGeneratorToggleNode = isPrimarySource => new ToggleNode( model.sceneProperty, [ {
        value: model.waterScene,
        node: new WaterWaveGeneratorNode( model.waterScene, this.waveAreaNode, isPrimarySource )
      }, {
        value: model.soundScene,
        node: new SoundWaveGeneratorNode( model.soundScene, this.waveAreaNode, isPrimarySource )
      }, {
        value: model.lightScene,
        node: new LightWaveGeneratorNode( model.lightScene, this.waveAreaNode, isPrimarySource )
      } ], {
        alignChildren: ToggleNode.NONE
      } );

      this.addChild( perspective3DNode );

      this.addChild( waterDropLayer );
      this.addChild( waterSideViewNode );
      if ( options.showSceneSpecificWaveGeneratorNodes ) {
        this.addChild( createWaveGeneratorToggleNode( true ) ); // Primary source
        this.addChild( createWaveGeneratorToggleNode( false ) ); // Secondary source
      }
      else {

        // @protected - placeholder for alternative wave generator nodes
        this.waveGeneratorLayer = new Node();
        this.addChild( this.waveGeneratorLayer );
      }
      this.addChild( timeControls );
      this.addChild( soundParticleLayer );
      this.addChild( dashedLineNode );
      this.addChild( this.afterWaveAreaNode );
      this.addChild( waveAreaGraphNode );
      this.addChild( measuringTapeNode );
      this.addChild( timerNode );
      this.addChild( waveMeterNode );
    }

    /**
     * @param {Vector2} point
     * @returns {Vector2}
     * @public
     */
    globalToLatticeCoordinate( point ) {
      const latticeNode = this.sceneToNode( this.model.sceneProperty.value );

      const localPoint = latticeNode.globalToLocalPoint( point );
      return LatticeCanvasNode.localPointToLatticePoint( localPoint );
    }

    /**
     * Notify listeners of the step phase.
     * @param {number} dt - in seconds
     * @public
     */
    step( dt ) {
      this.steppedEmitter.emit();
    }
  }

  /**
   * @static
   * @public
   */
  WavesScreenView.SPACING = SPACING;

  return waveInterference.register( 'WavesScreenView', WavesScreenView );
} );