// Copyright 2018, University of Colorado Boulder

/**
 * View for the "Waves" screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  var Color = require( 'SCENERY/util/Color' );
  var WaveInterferenceControlPanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceControlPanel' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/common/view/DottedLineNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  var IntensityGraphPanel = require( 'WAVE_INTERFERENCE/common/view/IntensityGraphPanel' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Perspective3DNode = require( 'WAVE_INTERFERENCE/common/view/Perspective3DNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/ScaleIndicatorNode' );
  var SceneType = require( 'WAVE_INTERFERENCE/common/model/SceneType' );
  var ScreenNode = require( 'WAVE_INTERFERENCE/common/view/ScreenNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TimeControlPanel = require( 'WAVE_INTERFERENCE/common/view/TimeControlPanel' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var ToolboxPanel = require( 'WAVE_INTERFERENCE/common/view/ToolboxPanel' );
  var Util = require( 'SCENERY/util/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ViewRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/ViewRadioButtonGroup' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  var WaterSideViewNode = require( 'WAVE_INTERFERENCE/common/view/WaterSideViewNode' );
  var WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaGraphNode' );
  var WaveAreaNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var MARGIN = 8;
  var SPACING = 6;
  var WAVE_MARGIN = 8;
  var WATER_BLUE = new Color( '#58c0fa' );// TODO: Factor out color

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @param {Object} [options]
   * @constructor
   */
  function WavesScreenView( model, alignGroup, options ) {

    options = _.extend( {

      showViewRadioButtonGroup: false, // Only allow side view in single source/no slits context

      showPulseContinuousRadioButtons: true,

      // Nested options as discussed in https://github.com/phetsims/tasks/issues/730
      controlPanelOptions: {

        // This additional control (if present) will be shown beneath the Amplitude slider in the WaveInterferenceControlPanel
        additionalControl: null,

        // TODO: why are these options duplicated here?  Can we reuse them from WaveInterferenceControlPanel or omit them altogether?
        showIntensityCheckbox: true
      }
    }, options );
    ScreenView.call( this );

    // @private - for layout only
    this.waveAreaNode = new WaveAreaNode( model, {
      top: MARGIN + WAVE_MARGIN + 15,
      centerX: this.layoutBounds.centerX - 142
    } );
    this.addChild( this.waveAreaNode );

    // @private show the scale of the wave area // TODO: local var?
    this.scaleIndicatorNode = new ScaleIndicatorNode( model.sceneProperty, {
      top: MARGIN,
      left: this.waveAreaNode.left
    } );
    this.addChild( this.scaleIndicatorNode );

    var waveAreaGraphNode = new WaveAreaGraphNode( model, this.waveAreaNode.bounds, {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.top + this.waveAreaNode.height * 0.75
    } );

    var dottedLineNode = new DottedLineNode( {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.centerY
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN
    } );
    this.addChild( resetAllButton );

    // TODO: don't show interference pattern in side view of water.

    if ( options.showViewRadioButtonGroup ) {
      var viewRadioButtonGroup = new ViewRadioButtonGroup( model.viewTypeProperty, {
        bottom: this.layoutBounds.bottom - MARGIN,
        left: this.waveAreaNode.left + SPACING + 10 // TODO: layout
      } );
      this.addChild( viewRadioButtonGroup );
    }

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    webGLSupported = false; // TODO: fix this

    this.latticeNode = webGLSupported ? new LatticeWebGLNode( model.lattice, {

                                        // TODO: I don't understand the positioning of this node
                                        x: 67,
                                        y: -170
                                      } ) :
                       new LatticeCanvasNode( model.lattice );

    var self = this;

    var scale = this.waveAreaNode.width / this.latticeNode.width;
    this.latticeNode.mutate( {
      scale: scale,
      center: this.waveAreaNode.center
    } );

    var screenNode = new ScreenNode( model.lattice, model.intensitySample, {
      scale: scale,
      left: this.waveAreaNode.right + 5,
      y: this.waveAreaNode.top
    } );

    // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
    Property.multilink( [ model.showScreenProperty, model.sceneProperty ], function( showScreen, scene ) {
      screenNode.visible = showScreen && scene === SceneType.LIGHT;
    } );

    // Set the color of highlight on the screen and lattice
    Property.multilink( [ model.frequencyProperty, model.sceneProperty ], function( frequency, scene ) {
      if ( scene === SceneType.LIGHT ) {
        var baseColor = VisibleColor.frequencyToColor( frequency );
        self.latticeNode.setBaseColor( baseColor );
        self.latticeNode.vacuumColor = Color.black;
        screenNode.setBaseColor( baseColor );
      }
      else if ( scene === SceneType.SOUND ) {
        self.latticeNode.setBaseColor( Color.white );
        self.latticeNode.vacuumColor = null;
        screenNode.setBaseColor( Color.white );
      }
      else if ( scene === SceneType.WATER ) {
        self.latticeNode.setBaseColor( WATER_BLUE );
        self.latticeNode.vacuumColor = null;
        screenNode.setBaseColor( WATER_BLUE );
      }
    } );
    model.showScreenProperty.linkAttribute( screenNode, 'visible' );

    this.addChild( screenNode );
    this.addChild( this.latticeNode );

    var intensityGraphPanel = new IntensityGraphPanel( this.latticeNode.height, model.intensitySample, {
      left: screenNode.right + 5
    } );
    Property.multilink( [ model.showIntensityGraphProperty, model.sceneProperty ], function( showIntensityGraph, scene ) {

      // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
      intensityGraphPanel.visible = showIntensityGraph && scene === SceneType.LIGHT;
    } );
    this.addChild( intensityGraphPanel );

    // Make sure the charting area is perfectly aligned with the wave area
    intensityGraphPanel.translate( 0, this.latticeNode.globalBounds.top - intensityGraphPanel.getChartGlobalBounds().top );

    var measuringTapeNode = new MeasuringTapeNode( new Property( {
      name: 'cm',
      multiplier: 10
    } ), new BooleanProperty( true ), {
      basePositionProperty: new Property( new Vector2( 200, 200 ) ),
      tipPositionProperty: new Property( new Vector2( 220, 200 ) ),

      // Drop in toolbox
      baseDragEnded: function() {
        var toolboxGlobalBounds = toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds );
        var bodyCenterPoint = measuringTapeNode.localToGlobalPoint( measuringTapeNode.baseImage.center );
        if ( toolboxGlobalBounds.containsPoint( bodyCenterPoint ) ) {
          model.isMeasuringTapeInPlayAreaProperty.value = false;
        }
      }
    } );
    model.isMeasuringTapeInPlayAreaProperty.linkAttribute( measuringTapeNode, 'visible' );

    var timerNode = new TimerNode( model.timerElapsedTimeProperty, model.isTimerRunningProperty );
    var timerNodeDragListener = new DragListener( {
      translateNode: true,

      // Drop in toolbox
      end: function() {
        var toolboxGlobalBounds = toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds );
        var centerPoint = timerNode.parentToGlobalPoint( timerNode.center );
        if ( toolboxGlobalBounds.containsPoint( centerPoint ) ) {
          model.isTimerInPlayAreaProperty.value = false;
        }
      }
    } );
    timerNode.timerNodeDragListener = timerNodeDragListener; // TODO: fix this, perhaps a subclass
    timerNode.addInputListener( timerNodeDragListener );
    model.isTimerInPlayAreaProperty.linkAttribute( timerNode, 'visible' );

    var waveDetectorToolNode = new WaveDetectorToolNode( model, this, {

      // Drop in toolbox
      end: function() {
        var toolboxGlobalBounds = toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds );
        var centerPoint = waveDetectorToolNode.getBackgroundNodeGlobalBounds().center;
        if ( toolboxGlobalBounds.containsPoint( centerPoint ) ) {
          model.isWaveDetectorToolNodeInPlayAreaProperty.value = false;
          waveDetectorToolNode.alignProbes();
        }
      }
    } );
    model.isWaveDetectorToolNodeInPlayAreaProperty.link( function( isWaveDetectorToolNodeInPlayArea ) {
      waveDetectorToolNode.visible = isWaveDetectorToolNodeInPlayArea;

      // Make sure probes are re-aligned on reset-all
      waveDetectorToolNode.alignProbes();
    } );

    var toolboxPanel = new ToolboxPanel( measuringTapeNode, timerNode, waveDetectorToolNode, alignGroup, model );
    var updateToolboxPosition = function() {
      toolboxPanel.mutate( {
        right: self.layoutBounds.right - MARGIN,
        top: MARGIN
      } );
    };
    updateToolboxPosition();

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
    toolboxPanel.on( 'bounds', updateToolboxPosition );
    this.addChild( toolboxPanel );

    // @protected {WaveInterferenceControlPanel} for subtype layout
    this.controlPanel = new WaveInterferenceControlPanel( model, alignGroup, _.extend( {}, options.controlPanelOptions ) );

    var updateControlPanelPosition = function() {
      self.controlPanel.mutate( {
        right: self.layoutBounds.right - MARGIN,
        top: toolboxPanel.bottom + SPACING
      } );
    };
    updateControlPanelPosition();

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.
    this.controlPanel.on( 'bounds', updateControlPanelPosition );
    this.addChild( this.controlPanel );

    if ( options.showPulseContinuousRadioButtons ) {

      // TODO: move this to a new file
      var continuousPulseGroup = new RadioButtonGroup( model.inputTypeProperty, [ {
        value: IncomingWaveType.PULSE,
        node: new InputTypeIconNode( IncomingWaveType.PULSE )
      }, {
        value: IncomingWaveType.CONTINUOUS,
        node: new InputTypeIconNode( IncomingWaveType.CONTINUOUS )
      } ], {
        orientation: 'horizontal',
        buttonContentXMargin: 0,
        buttonContentYMargin: 8,
        selectedLineWidth: 2,
        baseColor: 'white',
        disabledBaseColor: 'white',
        selectedStroke: 'blue',
        deselectedContentOpacity: 0.4,
        bottom: this.layoutBounds.bottom - MARGIN,
        left: this.layoutBounds.left + MARGIN
      } );
      this.addChild( continuousPulseGroup );
    }

    var timeControlPanel = new TimeControlPanel( model, {
      bottom: this.layoutBounds.bottom - MARGIN
    } );

    // Show a gray background for the water to make it easier to see the dotted line in the middle of the screen,
    // and visually partition the play area
    var waterGrayBackground = Rectangle.bounds( this.waveAreaNode.bounds, { fill: '#e2e3e5' } );
    this.addChild( waterGrayBackground );

    // Play/Pause button centered under the wave area
    timeControlPanel.left = this.waveAreaNode.centerX - timeControlPanel.playPauseButton.width / 2;

    // Show the side of the water, when fully rotated and in WATER scene
    var waterSideViewNode = new WaterSideViewNode( this.waveAreaNode.bounds, model );
    Property.multilink( [ model.rotationAmountProperty, model.sceneProperty ], function( rotationAmount, scene ) {
      waterSideViewNode.visible = rotationAmount === 1.0 && scene === SceneType.WATER;
      waterGrayBackground.visible = rotationAmount !== 1 && rotationAmount !== 0 && scene === SceneType.WATER;
    } );

    Property.multilink( [ model.rotationAmountProperty, model.sceneProperty ], function( rotationAmount, scene ) {
      var isRotating = rotationAmount > 0 && rotationAmount < 1; // TODO: factor out?
      var isSideWater = rotationAmount === 1 && scene === SceneType.WATER;
      var show = !isRotating && !isSideWater;
      self.waveAreaNode.visible = show;
      self.latticeNode.visible = show;
    } );

    Property.multilink( [ model.rotationAmountProperty, model.showGraphProperty, model.sceneProperty ], function( rotationAmount, showGraph, scene ) {
      var isRotating = rotationAmount > 0 && rotationAmount < 1; // TODO: factor out?
      waveAreaGraphNode.visible = !isRotating && showGraph;
      dottedLineNode.visible = !isRotating && showGraph;
    } );

    var perspective3DNode = new Perspective3DNode( this.waveAreaNode.bounds, model.rotationAmountProperty );

    // Initialize and update the colors based on the scene
    Property.multilink( [ model.frequencyProperty, model.sceneProperty ], function( frequency, scene ) {

      // TODO: this looks odd for light when the wave area is black
      perspective3DNode.setTopFaceColor( scene === SceneType.WATER ? '#3981a9' : scene === SceneType.SOUND ? 'gray' : VisibleColor.frequencyToColor( frequency ) );
      perspective3DNode.setSideFaceColor( scene === SceneType.WATER ? '#58c0fa' : scene === SceneType.SOUND ? 'darkGray' : VisibleColor.frequencyToColor( frequency ).colorUtilsDarker( 0.15 ) );
    } );
    this.addChild( perspective3DNode );

    this.addChild( waterSideViewNode );
    this.addChild( timeControlPanel );
    this.addChild( dottedLineNode );
    this.addChild( waveAreaGraphNode );
    this.addChild( measuringTapeNode );
    this.addChild( timerNode );
    this.addChild( waveDetectorToolNode );

    var laserPointerOptions = {
      bodySize: new Dimension2( 80, 40 ),
      nozzleSize: new Dimension2( 10, 28 ),
      buttonRadius: 18,
      hasGlass: true,
      rightCenter: this.waveAreaNode.leftCenter.plusXY( 20, 0 )
    };
    var laserPointerNode1 = new LaserPointerNode( model.button1PressedProperty, laserPointerOptions );
    var laserPointerNode2 = new LaserPointerNode( model.button2PressedProperty, laserPointerOptions );

    var updateEnabled = function() {
      if ( model.inputTypeProperty.value === IncomingWaveType.PULSE ) {
        laserPointerNode1.enabled = !model.pulseFiringProperty.value;
        laserPointerNode2.enabled = !model.pulseFiringProperty.value;
      }
      else if ( model.inputTypeProperty.value === IncomingWaveType.CONTINUOUS ) {
        laserPointerNode1.enabled = true;
        laserPointerNode2.enabled = true;
      }
    };
    model.inputTypeProperty.link( updateEnabled );
    model.pulseFiringProperty.link( updateEnabled );
    this.addChild( laserPointerNode1 );
    this.addChild( laserPointerNode2 );

    model.sourceSeparationProperty.link( function( sourceSeparation ) {
      laserPointerNode2.visible = sourceSeparation > 0;
      laserPointerNode1.centerY = self.waveAreaNode.centerY + sourceSeparation * 4; // TODO: fix coordinate transform
      laserPointerNode2.centerY = self.waveAreaNode.centerY - sourceSeparation * 4; // TODO: fix coordinate transform
    } );
  }

  waveInterference.register( 'WavesScreenView', WavesScreenView );

  return inherit( ScreenView, WavesScreenView, {

    /**
     * @param {Vector2} point
     * @public
     */
    globalToLatticeCoordinate: function( point ) {
      var localPoint = this.latticeNode.globalToLocalPoint( point );
      return this.latticeNode.localPointToLatticePoint( localPoint );
    }
  }, {
    SPACING: SPACING
  } );
} );