// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );

  class ToolboxPanel extends WaveInterferencePanel {

    /**
     * @param {MeasuringTapeNode} measuringTapeNode
     * @param {WaveInterferenceTimerNode} timerNode
     * @param {MeterBodyNode} meterNode
     * @param {AlignGroup} alignGroup - to align with neighbors
     * @param {WavesScreenModel} model
     * @param {Object} [options]
     */
    constructor( measuringTapeNode, timerNode, meterNode, alignGroup, model, options ) {
      model.isMeasuringTapeInPlayAreaProperty.value = true;
      measuringTapeNode.setTextVisible( false );
      const measuringTapeIconNode = measuringTapeNode.rasterized( { wrap: true } ).mutate( { scale: 0.7 } );
      model.isMeasuringTapeInPlayAreaProperty.value = false;
      measuringTapeNode.setTextVisible( true );

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
      model.isTimerInPlayAreaProperty.value = true;
      const iconTimerNode = timerNode.rasterized().mutate( { scale: 0.5 } );
      model.isTimerInPlayAreaProperty.value = false;

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      const timerNodeIcon = createIcon( iconTimerNode, model.isTimerInPlayAreaProperty, event => {
        timerNode.center = this.globalToParentPoint( event.pointer.point );

        // timerNode provided as targetNode in the DragListener constructor, so this press will target it
        timerNode.timerNodeDragListener.press( event );
        model.isTimerInPlayAreaProperty.value = true;
      } );

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      // Temporarily show the node so it can be rasterized for an icon
      model.isWaveMeterInPlayAreaProperty.value = true;
      const icon = meterNode.rasterized().mutate( { scale: 0.3 } );
      model.isWaveMeterInPlayAreaProperty.value = false;

      const waveMeterIcon = createIcon( icon, model.isWaveMeterInPlayAreaProperty, event => {
        meterNode.center = this.globalToParentPoint( event.pointer.point );

        // Set the internal flag that indicates the probes should remain in alignment during the drag
        meterNode.synchronizeProbeLocations = true;
        meterNode.startDrag( event );
        model.isWaveMeterInPlayAreaProperty.value = true;
      } );

      // Layout for the toolbox
      super( alignGroup.createBox( new HBox( {
          spacing: 10,
          children: [
            measuringTapeIcon,
            timerNodeIcon,
            waveMeterIcon
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