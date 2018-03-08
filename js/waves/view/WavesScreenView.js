// Copyright 2018, University of Colorado Boulder

/**
 * View for the "Waves" screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ChartToolNode = require( 'WAVE_INTERFERENCE/waves/view/ChartToolNode' );
  var ControlPanel = require( 'WAVE_INTERFERENCE/waves/view/ControlPanel' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/waves/view/DottedLineNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var IncidentWaveTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/IncidentWaveTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/SceneTypeEnum' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TimeControlPanel = require( 'WAVE_INTERFERENCE/waves/view/TimeControlPanel' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var ToolboxPanel = require( 'WAVE_INTERFERENCE/waves/view/ToolboxPanel' );
  var Util = require( 'SCENERY/util/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ViewRadioButtonGroup = require( 'WAVE_INTERFERENCE/waves/view/ViewRadioButtonGroup' );
  var WaveAreaGraphNode = require( 'WAVE_INTERFERENCE/waves/view/WaveAreaGraphNode' );
  var WaveAreaNode = require( 'WAVE_INTERFERENCE/waves/view/WaveAreaNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );
  var WaveInterferenceVerticalAquaRadioButtonGroup = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceVerticalAquaRadioButtonGroup' );

  // constants
  var MARGIN = 10;
  var SPACING = 20;

  /**
   * @param {WavesScreenModel} model
   * @constructor
   */
  function WavesScreenView( model ) {
    ScreenView.call( this );

    var waveAreaNode = new WaveAreaNode( model, {
      top: MARGIN,
      centerX: this.layoutBounds.centerX
    } );
    this.addChild( waveAreaNode );

    var waveAreaGraphNode = new WaveAreaGraphNode( {
      x: waveAreaNode.left,
      centerY: WaveInterferenceConstants.WAVE_AREA_WIDTH * 0.75
    } );
    model.showGraphProperty.linkAttribute( waveAreaGraphNode, 'visible' );

    var dottedLineNode = new DottedLineNode( {
      x: waveAreaNode.left,
      centerY: waveAreaNode.centerY
    } );
    model.showGraphProperty.linkAttribute( dottedLineNode, 'visible' );
    this.addChild( dottedLineNode );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN
    } );
    this.addChild( resetAllButton );

    var viewRadioButtonGroup = new ViewRadioButtonGroup( model.viewTypeProperty, {
      bottom: waveAreaNode.bottom,
      left: waveAreaNode.right + MARGIN
    } );
    this.addChild( viewRadioButtonGroup );

    var controlPanelAlignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );

    var controlPanel = new ControlPanel( model, controlPanelAlignGroup, {
      right: this.layoutBounds.right - MARGIN,
      top: this.layoutBounds.top + MARGIN
    } );
    this.addChild( controlPanel );

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    // this.addChild( new LatticeNode( model.waveInterferenceModel.lattice ) );
    // this.addChild( new LatticeCanvasNode( waveInterferenceModel.lattice ) );
    if ( webGLSupported ) {

      // TODO: I don't understand the positioning of this node
      this.addChild( new LatticeWebGLNode( model.waveInterferenceModel.lattice, {
        x: 67,
        y: -170
      } ) );
    }
    else {
      this.addChild( new LatticeCanvasNode( model.waveInterferenceModel.lattice ) );
    }

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

    var timerNode = new TimerNode( model.stopwatchElapsedTimeProperty, model.isStopwatchRunningProperty );
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

    var chartToolNode = new ChartToolNode( {

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

    var toolboxPanel = new ToolboxPanel( measuringTapeNode, timerNode, chartToolNode, controlPanelAlignGroup, model, {
      left: controlPanel.left,
      top: controlPanel.bottom + SPACING
    } );
    this.addChild( toolboxPanel );

    var continuousPulseGroup = new WaveInterferenceVerticalAquaRadioButtonGroup( [ {
      node: new WaveInterferenceText( 'Continuous' ),
      value: IncidentWaveTypeEnum.CONTINUOUS,
      property: model.inputTypeProperty
    }, {
      node: new WaveInterferenceText( 'Pulse' ),
      value: IncidentWaveTypeEnum.PULSE,
      property: model.inputTypeProperty
    } ], {
      top: MARGIN,
      left: MARGIN
    } );
    this.addChild( continuousPulseGroup );

    var timeControlPanel = new TimeControlPanel( model, {
      bottom: this.layoutBounds.bottom - MARGIN,
      right: waveAreaNode.right
    } );
    this.addChild( timeControlPanel );

    var sceneRadioButtons = new RadioButtonGroup( model.sceneProperty, [ {
      value: SceneTypeEnum.WATER,
      node: new WaveInterferenceText( 'water' )
    }, {
      value: SceneTypeEnum.SOUND,
      node: new WaveInterferenceText( 'sound' )
    }, {
      value: SceneTypeEnum.LIGHT,
      node: new WaveInterferenceText( 'light' )
    } ], {
      orientation: 'horizontal',
      bottom: this.layoutBounds.bottom - MARGIN,
      left: waveAreaNode.left
    } );
    this.addChild( waveAreaGraphNode );
    this.addChild( sceneRadioButtons );
    this.addChild( measuringTapeNode );
    this.addChild( timerNode );
    this.addChild( chartToolNode );
  }

  waveInterference.register( 'WavesScreenView', WavesScreenView );

  return inherit( ScreenView, WavesScreenView );
} );