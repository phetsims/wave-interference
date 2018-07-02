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
  var Color = require( 'SCENERY/util/Color' );
  var DashedLineNode = require( 'WAVE_INTERFERENCE/common/view/DashedLineNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntensityGraphPanel = require( 'WAVE_INTERFERENCE/common/view/IntensityGraphPanel' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Perspective3DNode = require( 'WAVE_INTERFERENCE/common/view/Perspective3DNode' );
  var PulseContinuousRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/PulseContinuousRadioButtonGroup' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/ScaleIndicatorNode' );
  var ScreenNode = require( 'WAVE_INTERFERENCE/common/view/ScreenNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TimeControlPanel = require( 'WAVE_INTERFERENCE/common/view/TimeControlPanel' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var ToolboxPanel = require( 'WAVE_INTERFERENCE/common/view/ToolboxPanel' );
  var Util = require( 'SCENERY/util/Util' );
  var ViewRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/ViewRadioButtonGroup' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  var WaterSideViewNode = require( 'WAVE_INTERFERENCE/common/view/WaterSideViewNode' );
  var WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaGraphNode' );
  var WaveAreaNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaNode' );
  var WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceControlPanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceControlPanel' );

  // constants
  var MARGIN = 8;
  var SPACING = 6;
  var WAVE_MARGIN = 8;
  var WATER_BLUE = WaveInterferenceConstants.WATER_SIDE_COLOR;

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

      // Nested options as discussed in https://github.com/phetsims/tasks/issues/730, see WaveInterferenceControlPanel for keys/values
      controlPanelOptions: {}
    }, options );
    ScreenView.call( this );

    // @private - for layout only
    this.waveAreaNode = new WaveAreaNode( model, {
      top: MARGIN + WAVE_MARGIN + 15,
      centerX: this.layoutBounds.centerX - 142
    } );
    this.addChild( this.waveAreaNode );

    // @private show the scale of the wave area // TODO: local var?
    this.scaleIndicatorNode = new ScaleIndicatorNode( model, this.waveAreaNode.width, {
      top: MARGIN,
      left: this.waveAreaNode.left
    } );
    this.addChild( this.scaleIndicatorNode );

    var waveAreaGraphNode = new WaveAreaGraphNode( model, this.waveAreaNode.bounds, {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.top + this.waveAreaNode.height * 0.75
    } );

    var dashedLineNode = new DashedLineNode( {
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

    if ( options.showViewRadioButtonGroup ) {
      this.addChild( new ViewRadioButtonGroup( model.viewTypeProperty, {
        bottom: this.layoutBounds.bottom - MARGIN,
        left: this.waveAreaNode.left + SPACING + 10 // TODO: layout
      } ) );
    }

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl && false;

    this.latticeNode = webGLSupported ?
                       new LatticeWebGLNode( model.lattice ) :
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
      screenNode.visible = showScreen && scene === model.lightScene;
    } );

    // Set the color of highlight on the screen and lattice
    Property.multilink( [ model.sceneProperty, model.lightScene.frequencyProperty ], function( scene, lightFrequency ) {
      if ( scene === model.lightScene ) {
        var baseColor = VisibleColor.frequencyToColor( lightFrequency );
        self.latticeNode.setBaseColor( baseColor );
        self.latticeNode.vacuumColor = Color.black;
        screenNode.setBaseColor( baseColor );
      }
      else if ( scene === model.soundScene ) {
        self.latticeNode.setBaseColor( Color.white );
        self.latticeNode.vacuumColor = null;
        screenNode.setBaseColor( Color.white );
      }
      else if ( scene === model.waterScene ) {
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
      intensityGraphPanel.visible = showIntensityGraph && scene === model.lightScene;
    } );
    this.addChild( intensityGraphPanel );

    // Make sure the charting area is perfectly aligned with the wave area
    intensityGraphPanel.translate( 0, this.latticeNode.globalBounds.top - intensityGraphPanel.getChartGlobalBounds().top );

    var measuringTapeProperty = new Property( {
      name: 'cm',
      multiplier: 10
    } );
    model.sceneProperty.link( function( scene ) {
      measuringTapeProperty.set( {
        name: scene.measuringTapeUnits,
        multiplier: scene.latticeWidth / self.waveAreaNode.width / scene.meterUnitsConversion
      } );
    } );

    var measuringTapeNode = new MeasuringTapeNode( measuringTapeProperty, new BooleanProperty( true ), {
      textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )', // translucent white background, same value as in Projectile Motion, see https://github.com/phetsims/projectile-motion/issues/156
      textColor: 'black',
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,

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

    var timerNode = new TimerNode( model.timerElapsedTimeProperty, model.isTimerRunningProperty, {
      unitsChoices: [ model.waterScene.timerUnits, model.soundScene.timerUnits, model.lightScene.timerUnits ]
    } );
    var timerNodeDragListener = new DragListener( {
      targetNode: timerNode,
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
    model.sceneProperty.link( function( scene ) {
      timerNode.setUnits( scene.timerUnits );
    } );

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

    model.resetEmitter.addListener( function() {
      waveDetectorToolNode.reset();
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
    this.controlPanel = new WaveInterferenceControlPanel( model, alignGroup, options.controlPanelOptions );

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

      var continuousPulseGroup = new PulseContinuousRadioButtonGroup( model.inputTypeProperty, {
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
      waterSideViewNode.visible = rotationAmount === 1.0 && scene === model.waterScene;
      waterGrayBackground.visible = rotationAmount !== 1 && rotationAmount !== 0 && scene === model.waterScene;
    } );

    Property.multilink( [ model.rotationAmountProperty, model.isRotatingProperty, model.sceneProperty ], function( rotationAmount, isRotating, scene ) {
      var isSideWater = rotationAmount === 1 && scene === model.waterScene;
      var show = !isRotating && !isSideWater;
      self.waveAreaNode.visible = show;
      self.latticeNode.visible = show;
    } );

    Property.multilink( [ model.rotationAmountProperty, model.isRotatingProperty, model.showGraphProperty ], function( rotationAmount, isRotating, showGraph ) {
      waveAreaGraphNode.visible = !isRotating && showGraph;
      dashedLineNode.visible = !isRotating && showGraph;
    } );

    var perspective3DNode = new Perspective3DNode( this.waveAreaNode.bounds, model.rotationAmountProperty, model.isRotatingProperty );

    // Initialize and update the colors based on the scene
    Property.multilink( [ model.sceneProperty, model.lightScene.frequencyProperty ], function( scene, frequency ) {
      perspective3DNode.setTopFaceColor( scene === model.waterScene ? '#3981a9' : scene === model.soundScene ? 'gray' : VisibleColor.frequencyToColor( frequency ) );
      perspective3DNode.setSideFaceColor( scene === model.waterScene ? WaveInterferenceConstants.WATER_SIDE_COLOR : scene === model.soundScene ? 'darkGray' : VisibleColor.frequencyToColor( frequency ).colorUtilsDarker( 0.15 ) );
    } );
    this.addChild( perspective3DNode );

    this.addChild( waterSideViewNode );
    this.addChild( timeControlPanel );
    this.addChild( dashedLineNode );
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
      laserPointerNode1.centerY = self.waveAreaNode.centerY + sourceSeparation * 4; // TODO: fix coordinate transform, source separation should be in metric coordinates
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