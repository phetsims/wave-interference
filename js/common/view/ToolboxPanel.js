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
   * @param {WaveInterferenceTimerNode} timerNode
   * @param {WaveDetectorToolNode} waveDetectorToolNode
   * @param {AlignGroup} alignGroup - to align with neighbors
   * @param {WavesScreenModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ToolboxPanel( measuringTapeNode, timerNode, waveDetectorToolNode, alignGroup, model, options ) {
    var self = this;
    var measuringTapeIconNode = new MeasuringTapeNode( new Property( {
      name: 'cm',
      multiplier: 1000
    } ), new BooleanProperty( true ), {
      tipPositionProperty: new Property( new Vector2( 20, 0 ) ),
      hasValue: false,
      interactive: false,
      scale: 0.7
    } );

    var measuringTapeIcon = createIcon( measuringTapeIconNode, model.isMeasuringTapeInPlayAreaProperty, function( event ) {

      // When clicking on the measuring tape icon, pop it out into the play area
      var targetPosition = self.globalToParentPoint( event.pointer.point );
      var currentPosition = measuringTapeNode.basePositionProperty.value;
      var delta = targetPosition.minus( currentPosition );
      measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
      measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
      measuringTapeNode.startBaseDrag( event );
      model.isMeasuringTapeInPlayAreaProperty.value = true;
    } );

    // Node used to create the icon
    var iconTimerNode = new TimerNode( new NumberProperty( 0 ), new BooleanProperty( false ), {
      scale: 0.5,
      pickable: false
    } );

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    var timerNodeIcon = createIcon( iconTimerNode, model.isTimerInPlayAreaProperty, function( event ) {
      timerNode.center = self.globalToParentPoint( event.pointer.point );

      // timerNode provided as targetNode in the DragListener constructor, so this press will target it
      timerNode.timerNodeDragListener.press( event );
      model.isTimerInPlayAreaProperty.value = true;
    } );

    var waveDetectorToolNodeIcon = new WaveDetectorToolNode( model, null, {
      isIcon: true,
      scale: 0.3
    } );

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    var waveDetectorNodeIcon = createIcon( waveDetectorToolNodeIcon, model.isWaveDetectorToolNodeInPlayAreaProperty, function( event ) {
      waveDetectorToolNode.center = self.globalToParentPoint( event.pointer.point );
      waveDetectorToolNode.startDrag( event );
      model.isWaveDetectorToolNodeInPlayAreaProperty.value = true;
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

  /**
   * Adds a transparent overlay to a Node, so that a node can be dragged out without its own internal buttons being
   * pressed.  This implementation previously used toImage() but it was too aliased.
   * @param {Node} node
   * @param {Property.<Boolean>} inPlayAreaProperty
   * @param {Object} forwardingListener
   */
  var createIcon = function( node, inPlayAreaProperty, forwardingListener ) {
    var iconNode = new Node( {
      cursor: 'pointer',
      children: [
        node,
        Rectangle.bounds( node.bounds, { fill: 'rgba(0,0,0,0)' } )
      ]
    } );
    inPlayAreaProperty.link( function( inPlayArea ) {
      iconNode.visible = !inPlayArea;
    } );
    iconNode.addInputListener( DragListener.createForwardingListener( forwardingListener ) );
    return iconNode;
  };

  waveInterference.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( WaveInterferencePanel, ToolboxPanel );
} );