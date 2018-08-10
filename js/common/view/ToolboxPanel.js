// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );

  class ToolboxPanel extends WaveInterferencePanel {

    /**
     * @param {MeasuringTapeNode} measuringTapeNode
     * @param {WaveInterferenceTimerNode} timerNode
     * @param {WaveDetectorToolNode} waveDetectorToolNode
     * @param {AlignGroup} alignGroup - to align with neighbors
     * @param {WavesScreenModel} model
     * @param {Object} [options]
     */
    constructor( measuringTapeNode, timerNode, waveDetectorToolNode, alignGroup, model, options ) {
      const measuringTapeIconNode = new MeasuringTapeNode( new Property( {
        name: 'cm',
        multiplier: 1000
      } ), new BooleanProperty( true ), {
        tipPositionProperty: new Property( new Vector2( 20, 0 ) ),
        hasValue: false,
        interactive: false,
        scale: 0.7
      } );

      const measuringTapeIcon = createIcon( measuringTapeIconNode, model.isMeasuringTapeInPlayAreaProperty, event => {

        // When clicking on the measuring tape icon, pop it out into the play area
        const targetPosition = this.globalToParentPoint( event.pointer.point );
        const currentPosition = measuringTapeNode.basePositionProperty.value;
        const delta = targetPosition.minus( currentPosition );
        measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
        measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
        measuringTapeNode.startBaseDrag( event );
        model.isMeasuringTapeInPlayAreaProperty.value = true;
      } );

      // Node used to create the icon
      const iconTimerNode = new TimerNode( new NumberProperty( 0 ), new BooleanProperty( false ), {
        scale: 0.5,
        pickable: false
      } );

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      const timerNodeIcon = createIcon( iconTimerNode, model.isTimerInPlayAreaProperty, event => {
        timerNode.center = this.globalToParentPoint( event.pointer.point );

        // timerNode provided as targetNode in the DragListener constructor, so this press will target it
        timerNode.timerNodeDragListener.press( event );
        model.isTimerInPlayAreaProperty.value = true;
      } );

      const waveDetectorToolNodeIcon = new WaveDetectorToolNode( model, null, {
        isIcon: true,
        scale: 0.3
      } );

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      const waveDetectorNodeIcon = createIcon( waveDetectorToolNodeIcon, model.isWaveDetectorToolNodeInPlayAreaProperty, event => {
        waveDetectorToolNode.center = this.globalToParentPoint( event.pointer.point );
        waveDetectorToolNode.startDrag( event );
        model.isWaveDetectorToolNodeInPlayAreaProperty.value = true;
      } );

      // Layout for the toolbox
      super( alignGroup.createBox( new HBox( {
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
  }

  /**
   * Adds a transparent overlay to a Node, so that a node can be dragged out without its own internal buttons being
   * pressed.  This implementation previously used toImage() but it was too aliased.
   * @param {Node} node
   * @param {Property.<Boolean>} inPlayAreaProperty
   * @param {Object} forwardingListener
   */
  const createIcon = ( node, inPlayAreaProperty, forwardingListener ) => {
    const iconNode = new Node( {
      cursor: 'pointer',
      children: [
        node,
        Rectangle.bounds( node.bounds, { fill: 'rgba(0,0,0,0)' } )
      ]
    } );
    inPlayAreaProperty.link( inPlayArea => { iconNode.visible = !inPlayArea; } );
    iconNode.addInputListener( DragListener.createForwardingListener( forwardingListener ) );
    return iconNode;
  };

  return waveInterference.register( 'ToolboxPanel', ToolboxPanel );
} );