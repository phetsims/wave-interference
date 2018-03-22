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
  var ChartToolNode = require( 'WAVE_INTERFERENCE/common/view/ChartToolNode' );
  var ControlPanel = require( 'WAVE_INTERFERENCE/common/view/ControlPanel' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/common/view/DottedLineNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  var IntensityGraphPanel = require( 'WAVE_INTERFERENCE/common/view/IntensityGraphPanel' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var OscillationTypeEnum = require( 'WAVE_INTERFERENCE/common/model/OscillationTypeEnum' );
  var Perspective3DNode = require( 'WAVE_INTERFERENCE/common/view/Perspective3DNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var ScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/ScaleIndicatorNode' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SceneTypeEnum' );
  var ScreenNode = require( 'WAVE_INTERFERENCE/common/view/ScreenNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TimeControlPanel = require( 'WAVE_INTERFERENCE/common/view/TimeControlPanel' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var ToolboxPanel = require( 'WAVE_INTERFERENCE/common/view/ToolboxPanel' );
  var Util = require( 'SCENERY/util/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ViewRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/ViewRadioButtonGroup' );
  var WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaGraphNode' );
  var WaveAreaNode = require( 'WAVE_INTERFERENCE/common/view/WaveAreaNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var MARGIN = 8;
  var SPACING = 6;
  var WAVE_MARGIN = 8;

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @param {Object} [options]
   * @constructor
   */
  function WavesScreenView( model, alignGroup, options ) {

    options = _.extend( {

      // Nested options as discussed in https://github.com/phetsims/tasks/issues/730
      controlPanelOptions: {

        // This additional control (if present) will be shown beneath the Amplitude slider in the ControlPanel
        additionalControl: null
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

    var waveAreaGraphNode = new WaveAreaGraphNode( model, {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.top + this.waveAreaNode.height * 0.75
    } );
    model.showGraphProperty.linkAttribute( waveAreaGraphNode, 'visible' );

    var dottedLineNode = new DottedLineNode( {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.centerY
    } );
    model.showGraphProperty.linkAttribute( dottedLineNode, 'visible' );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN
    } );
    this.addChild( resetAllButton );

    var viewRadioButtonGroup = new ViewRadioButtonGroup( model.viewTypeProperty, {
      bottom: this.layoutBounds.bottom - MARGIN,
      left: this.waveAreaNode.left + SPACING + 10 // TODO: layout
    } );
    this.addChild( viewRadioButtonGroup );

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    webGLSupported = false; // TODO: fix this

    this.latticeNode = webGLSupported ? new LatticeWebGLNode( model.lattice, {

                                        // TODO: I don't understand the positioning of this node
                                        x: 67,
                                        y: -170
                                      } ) :
                       new LatticeCanvasNode( model.lattice );
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

    model.showScreenProperty.linkAttribute( screenNode, 'visible' );

    this.addChild( screenNode );
    this.addChild( this.latticeNode );

    var intensityGraphPanel = new IntensityGraphPanel( this.latticeNode.height, model.intensitySample, {
      left: screenNode.right + 5
    } );
    model.showIntensityGraphProperty.linkAttribute( intensityGraphPanel, 'visible' );
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

    var chartToolNode = new ChartToolNode( model, this, {

      // Drop in toolbox
      end: function() {
        var toolboxGlobalBounds = toolboxPanel.parentToGlobalBounds( toolboxPanel.bounds );
        var centerPoint = chartToolNode.getBackgroundNodeGlobalBounds().center;
        if ( toolboxGlobalBounds.containsPoint( centerPoint ) ) {
          model.isChartToolNodeInPlayAreaProperty.value = false;
          chartToolNode.alignProbes();
        }
      }
    } );
    model.isChartToolNodeInPlayAreaProperty.link( function( isChartToolNodeInPlayArea ) {
      chartToolNode.visible = isChartToolNodeInPlayArea;

      // Make sure probes are re-aligned on reset-all
      chartToolNode.alignProbes();
    } );

    var toolboxPanel = new ToolboxPanel( measuringTapeNode, timerNode, chartToolNode, alignGroup, model );
    var self = this;
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

    // @protected {ControlPanel} for subtype layout
    this.controlPanel = new ControlPanel( model, alignGroup, _.extend( {}, options.controlPanelOptions ) );

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

    var continuousPulseGroup = new RadioButtonGroup( model.inputTypeProperty, [ {
      value: OscillationTypeEnum.PULSE,
      node: new InputTypeIconNode( OscillationTypeEnum.PULSE )
    }, {
      value: OscillationTypeEnum.CONTINUOUS,
      node: new InputTypeIconNode( OscillationTypeEnum.CONTINUOUS )
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

    var timeControlPanel = new TimeControlPanel( model, {
      bottom: this.layoutBounds.bottom - MARGIN
    } );

    // Play/Pause button centered under the wave area
    timeControlPanel.left = this.waveAreaNode.centerX - timeControlPanel.playPauseButton.width / 2;
    this.addChild( timeControlPanel );

    this.addChild( dottedLineNode );
    this.addChild( waveAreaGraphNode );
    this.addChild( measuringTapeNode );
    this.addChild( timerNode );
    this.addChild( chartToolNode );

    // For testing
    var pulseButton = new RoundPushButton( {
      baseColor: 'red',
      right: this.waveAreaNode.left - SPACING,
      centerY: this.waveAreaNode.centerY
    } );
    pulseButton.addListener( function() {
      model.startPulse();
    } );
    this.addChild( pulseButton );
    var updateEnabled = function() {
      if ( model.inputTypeProperty.value === OscillationTypeEnum.PULSE ) {
        pulseButton.enabled = !model.pulseFiringProperty.value;
      }
      else {
        pulseButton.enabled = false;
      }
    };
    model.inputTypeProperty.link( updateEnabled );
    model.pulseFiringProperty.link( updateEnabled );

    var perspective3DNode = new Perspective3DNode( this.waveAreaNode.bounds, model.rotationAmountProperty );

    // Initialize and update the colors based on the scene
    model.sceneProperty.link( function( scene ) {
      perspective3DNode.setTopFaceColor( scene === SceneTypeEnum.WATER ? '#3981a9' : scene === SceneTypeEnum.SOUND ? 'gray' : 'red' );
      perspective3DNode.setSideFaceColor( scene === SceneTypeEnum.WATER ? '#58c0fa' : scene === SceneTypeEnum.SOUND ? 'darkGray' : 'red' );
    } );
    this.addChild( perspective3DNode );
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