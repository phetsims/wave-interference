// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
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
   * @param {WaveDetectorToolNode} waveDetectorToolNode
   * @param {AlignGroup} alignGroup - to align with neighbors
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ToolboxPanel( measuringTapeNode, timerNode, waveDetectorToolNode, alignGroup, model, options ) {
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

      // timerNode provided as targetNode in the DragListener constructor, so this press will target it
      timerNode.timerNodeDragListener.press( event );
      model.isTimerInPlayAreaProperty.value = true;
    } ) );
    model.isTimerInPlayAreaProperty.link( function( isTimerInPlayArea ) {
      timerNodeIcon.visible = !isTimerInPlayArea;
    } );

    var waveDetectorToolNodeIcon = new WaveDetectorToolNode( null, null, {
      scale: 0.3
    } );

    // TODO: factor out this pattern of icon node overlays
    // TODO: how does this differ from waveDetectorToolNodeIcon
    var waveDetectorNodeIcon = new Node( {
      cursor: 'pointer',
      children: [
        waveDetectorToolNodeIcon,

        // Overlay makes it possible to drag out of the toolbox by the buttons (instead of the buttons being pressed)
        // toImage() was too aliased
        Rectangle.bounds( waveDetectorToolNodeIcon.bounds, { fill: 'rgba(0,0,0,0)' } )
      ]
    } );
    waveDetectorNodeIcon.addInputListener( DragListener.createForwardingListener( function( event ) {
      waveDetectorToolNode.center = self.globalToParentPoint( event.pointer.point );
      waveDetectorToolNode.startDrag( event );
      model.isWaveDetectorToolNodeInPlayAreaProperty.value = true;
    } ) );
    model.isWaveDetectorToolNodeInPlayAreaProperty.link( function( isWaveDetectorToolNodeInPlayArea ) {
      waveDetectorNodeIcon.visible = !isWaveDetectorToolNodeInPlayArea;
    } );

    // Layout for the toolbox
    WaveInterferencePanel.call( this,
      alignGroup.createBox( new HBox( {
        spacing: 10,
        children: [
          measuringTapeIcon,
          timerNodeIcon,
          waveDetectorNodeIcon
        ]
      } ) ),
      options
    );
  }

  waveInterference.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( WaveInterferencePanel, ToolboxPanel );
} );