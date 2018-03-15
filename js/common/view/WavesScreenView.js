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
  var ChartToolNode = require( 'WAVE_INTERFERENCE/common/view/ChartToolNode' );
  var ControlPanel = require( 'WAVE_INTERFERENCE/common/view/ControlPanel' );
  var DottedLineNode = require( 'WAVE_INTERFERENCE/common/view/DottedLineNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var OscillationTypeEnum = require( 'WAVE_INTERFERENCE/common/model/OscillationTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
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
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  var MARGIN = 8;
  var SPACING = 6;

  /**
   * @param {WavesScreenModel} model
   * @constructor
   */
  function WavesScreenView( model ) {
    ScreenView.call( this );

    // @private
    this.waveAreaNode = new WaveAreaNode( model, {
      top: MARGIN,
      centerX: this.layoutBounds.centerX - 120
    } );
    this.addChild( this.waveAreaNode );

    var waveAreaGraphNode = new WaveAreaGraphNode( model, {
      x: this.waveAreaNode.left,
      centerY: WaveInterferenceConstants.WAVE_AREA_WIDTH * 0.75
    } );
    model.showGraphProperty.linkAttribute( waveAreaGraphNode, 'visible' );

    var dottedLineNode = new DottedLineNode( {
      x: this.waveAreaNode.left,
      centerY: this.waveAreaNode.centerY
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
      bottom: this.layoutBounds.bottom - MARGIN,
      left: this.waveAreaNode.left
    } );
    this.addChild( viewRadioButtonGroup );

    // @protected {AlignGroup} for making sure the control panels on the right hand side have the same width
    this.controlPanelAlignGroup = new AlignGroup( {

      // Elements should have the same widths but not constrained to have the same heights
      matchVertical: false
    } );

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    webGLSupported = false; // TODO: fix this

    this.latticeNode = webGLSupported ? new LatticeWebGLNode( model.lattice, {

                                        // TODO: I don't understand the positioning of this node
                                        x: 67,
                                        y: -170
                                      } ) :
                       new LatticeCanvasNode( model.lattice, { scale: 0.885, x: -50, y: -168 } );
    this.addChild( this.latticeNode );

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

    var toolboxPanel = new ToolboxPanel( measuringTapeNode, timerNode, chartToolNode, this.controlPanelAlignGroup, model, {
      right: this.layoutBounds.right - MARGIN,
      top: MARGIN
    } );
    this.addChild( toolboxPanel );

    // @protected {ControlPanel} for subtype layout
    this.controlPanel = new ControlPanel( model, this.controlPanelAlignGroup, {
      right: this.layoutBounds.right - MARGIN,
      top: toolboxPanel.bottom + SPACING
    } );
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