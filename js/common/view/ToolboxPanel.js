// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, stopwatch, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ChartToolNode = require( 'WAVE_INTERFERENCE/common/view/ChartToolNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );

  /**
   * @param {MeasuringTapeNode} measuringTapeNode
   * @param {TimerNode} timerNode
   * @param {ChartToolNode} chartToolNode
   * @param {AlignGroup} alignGroup - to align with neighbors
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ToolboxPanel( measuringTapeNode, timerNode, chartToolNode, alignGroup, model, options ) {
    var self = this;
    var measuringTapeIcon = new MeasuringTapeNode( new Property( {
      name: 'cm',
      multiplier: 1000
    } ), new BooleanProperty( true ), {
      tipPositionProperty: new Property( new Vector2( 20, 0 ) ),
      hasValue: false,
      interactive: false,
      scale: 0.7
    } );
    model.isMeasuringTapeInPlayAreaProperty.link( function( isMeasuringTapeInPlayArea ) {
      measuringTapeIcon.visible = !isMeasuringTapeInPlayArea;
    } );

    // When clicking on the measuring tape icon, pop it out into the play area
    measuringTapeIcon.addInputListener( DragListener.createForwardingListener( function( event ) {
      var targetPosition = self.globalToParentPoint( event.pointer.point );
      var currentPosition = measuringTapeNode.basePositionProperty.value;
      var delta = targetPosition.minus( currentPosition );
      measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
      measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
      measuringTapeNode.startBaseDrag( event );
      model.isMeasuringTapeInPlayAreaProperty.value = true;
    } ) );

    // Node used to create the icon
    var iconTimerNode = new TimerNode( new NumberProperty( 0 ), new BooleanProperty( false ), {
      scale: 0.5,
      pickable: false
    } );

    // The icon itself, which has an overlay to make the buttons draggable instead of pressable
    var timerNodeIcon = new Node( {
      cursor: 'pointer',
      children: [
        iconTimerNode,

        // Overlay makes it possible to drag out of the toolbox by the buttons (instead of the buttons being pressed)
        // toImage() was too aliased
        Rectangle.bounds( iconTimerNode.bounds, { fill: 'rgba(0,0,0,0)' } )
      ]
    } );
    timerNodeIcon.addInputListener( DragListener.createForwardingListener( function( event ) {
      timerNode.center = self.globalToParentPoint( event.pointer.point );
      timerNode.timerNodeDragListener.press( event, timerNode ); // TODO: what is better, this or targetNode: in the constructor?
      model.isTimerInPlayAreaProperty.value = true;
    } ) );
    model.isTimerInPlayAreaProperty.link( function( isTimerInPlayArea ) {
      timerNodeIcon.visible = !isTimerInPlayArea;
    } );

    var chartToolNodeForIcon = new ChartToolNode( {
      scale: 0.3
    } );

    // TODO: factor out this pattern of icon node overlays
    var chartToolNodeIcon = new Node( {
      cursor: 'pointer',
      children: [
        chartToolNodeForIcon,

        // Overlay makes it possible to drag out of the toolbox by the buttons (instead of the buttons being pressed)
        // toImage() was too aliased
        Rectangle.bounds( chartToolNodeForIcon.bounds, { fill: 'rgba(0,0,0,0)' } )
      ]
    } );
    chartToolNodeIcon.addInputListener( DragListener.createForwardingListener( function( event ) {
      chartToolNode.center = self.globalToParentPoint( event.pointer.point );
      chartToolNode.startDrag( event );
      model.isChartToolNodeInPlayAreaProperty.value = true;
    } ) );
    model.isChartToolNodeInPlayAreaProperty.link( function( isChartToolNodeInPlayArea ) {
      chartToolNodeIcon.visible = !isChartToolNodeInPlayArea;
    } );

    // Layout for the toolbox
    WaveInterferencePanel.call( this,
      alignGroup.createBox( new HBox( {
        spacing: 10,
        children: [
          measuringTapeIcon,
          timerNodeIcon,
          chartToolNodeIcon
        ]
      } ) ),
      options
    );
  }

  waveInterference.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( WaveInterferencePanel, ToolboxPanel );
} );