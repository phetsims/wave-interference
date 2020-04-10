// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';

class ToolboxPanel extends WaveInterferencePanel {

  /**
   * @param {MeasuringTapeNode} measuringTapeNode
   * @param {WaveInterferenceStopwatchNode} stopwatchNode
   * @param {WaveMeterNode} waveMeterNode
   * @param {AlignGroup} alignGroup - to align with neighbors
   * @param {Property.<Boolean>} isMeasuringTapeInPlayAreaProperty
   * @param {Property.<Vector2>} measuringTapeTipPositionProperty
   * @param {Property.<Boolean>} isStopwatchVisibleProperty
   * @param {Property.<Boolean>} isWaveMeterInPlayAreaProperty
   */
  constructor( measuringTapeNode, stopwatchNode, waveMeterNode, alignGroup, isMeasuringTapeInPlayAreaProperty,
               measuringTapeTipPositionProperty, isStopwatchVisibleProperty, isWaveMeterInPlayAreaProperty ) {

    // Capture image for icon
    isMeasuringTapeInPlayAreaProperty.value = true;
    measuringTapeNode.setTextVisible( false );
    measuringTapeTipPositionProperty.value = new Vector2( 220, 200 ); // Shorter tape for icon
    const measuringTapeIcon = measuringTapeNode.rasterized( { wrap: true } ).mutate( { scale: 0.65 } );
    measuringTapeTipPositionProperty.reset();
    isMeasuringTapeInPlayAreaProperty.value = false;
    measuringTapeNode.setTextVisible( true );

    initializeIcon( measuringTapeIcon, isMeasuringTapeInPlayAreaProperty, event => {

      // When clicking on the measuring tape icon, pop it out into the play area
      const targetPosition = this.globalToParentPoint( event.pointer.point );
      const currentPosition = measuringTapeNode.basePositionProperty.value;
      const delta = targetPosition.minus( currentPosition );
      measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
      measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
      measuringTapeNode.startBaseDrag( event );
      isMeasuringTapeInPlayAreaProperty.value = true;
    } );

    // Node used to create the icon
    isStopwatchVisibleProperty.value = true;
    const stopwatchNodeIcon = stopwatchNode.rasterized().mutate( { scale: 0.45 } );
    isStopwatchVisibleProperty.value = false;

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    initializeIcon( stopwatchNodeIcon, isStopwatchVisibleProperty, event => {
      stopwatchNode.center = this.globalToParentPoint( event.pointer.point );

      // stopwatchNode provided as targetNode in the DragListener constructor, so this press will target it
      stopwatchNode.dragListener.press( event );
      isStopwatchVisibleProperty.value = true;
    } );

    // Make sure the probes have enough breathing room so they don't get shoved into the WaveMeterNode icon.  Anything
    // above 60 seems to work equally well, closer than that causes the probes to overlap each other or the meter
    // body. The true translation is set when dragged out of the toolbox.
    waveMeterNode.backgroundNode.translate( 60, 0 );

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    // Temporarily show the node so it can be rasterized for an icon
    isWaveMeterInPlayAreaProperty.value = true;
    const waveMeterIcon = waveMeterNode.rasterized().mutate( { scale: 0.25 } );
    isWaveMeterInPlayAreaProperty.value = false;

    initializeIcon( waveMeterIcon, isWaveMeterInPlayAreaProperty, event => {

      // Fine-tuned empirically to set the drag point to be the center of the chart.
      waveMeterNode.backgroundNode.setTranslation( this.globalToParentPoint( event.pointer.point ).plusXY( -60, -66 ) );

      // Set the internal flag that indicates the probes should remain in alignment during the drag
      waveMeterNode.synchronizeProbeLocations = true;
      waveMeterNode.startDrag( event );
      isWaveMeterInPlayAreaProperty.value = true;
    } );

    // Layout for the toolbox
    super( alignGroup.createBox( new HBox( {
        spacing: 10,
        children: [
          measuringTapeIcon,
          stopwatchNodeIcon,
          waveMeterIcon
        ],
        excludeInvisibleChildrenFromBounds: false
      } ) ), {

        // Panel options
        yMargin: 9.55,
        maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH
      }
    );
  }
}

/**
 * Initialize the icon for use in the toolbox.
 * @param {Node} node
 * @param {Property.<boolean>} inPlayAreaProperty
 * @param {Object} forwardingListener
 */
const initializeIcon = ( node, inPlayAreaProperty, forwardingListener ) => {
  node.cursor = 'pointer';
  inPlayAreaProperty.link( inPlayArea => { node.visible = !inPlayArea; } );
  node.addInputListener( DragListener.createForwardingListener( forwardingListener ) );
};

waveInterference.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;