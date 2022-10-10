// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { AlignGroup, DragListener, HBox, InteractiveHighlightingNode } from '../../../../scenery/js/imports.js';
import { Vector2 } from '../../../../dot/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';
import WaveMeterNode from './WaveMeterNode.js';

class ToolboxPanel extends WaveInterferencePanel {

  public constructor( measuringTapeNode: MeasuringTapeNode, stopwatchNode: StopwatchNode, waveMeterNode: WaveMeterNode, alignGroup: AlignGroup, isMeasuringTapeInPlayAreaProperty: TReadOnlyProperty<boolean>,
                      measuringTapeTipPositionProperty: TReadOnlyProperty<Vector2>, isStopwatchVisibleProperty: TReadOnlyProperty<boolean>, isWaveMeterInPlayAreaProperty: TReadOnlyProperty<boolean> ) {

    // icon for the measuring tape
    const measuringTapeIcon = MeasuringTapeNode.createIcon( {
      scale: 0.65,
      tapeLength: 20
    } );

    const interactiveMeasuringTapeIcon = initializeIcon( measuringTapeIcon, isMeasuringTapeInPlayAreaProperty, event => {

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
    const interactiveStopwatchNodeIcon = initializeIcon( stopwatchNodeIcon, isStopwatchVisibleProperty, event => {
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

    const interactiveWaveMeterIcon = initializeIcon( waveMeterIcon, isWaveMeterInPlayAreaProperty, event => {

      // Fine-tuned empirically to set the drag point to be the center of the chart.
      waveMeterNode.backgroundNode.setTranslation( this.globalToParentPoint( event.pointer.point ).plusXY( -60, -66 ) );

      // Set the internal flag that indicates the probes should remain in alignment during the drag
      waveMeterNode.synchronizeProbePositions = true;
      waveMeterNode.startDrag( event );
      isWaveMeterInPlayAreaProperty.value = true;
    } );

    // Layout for the toolbox
    super( alignGroup.createBox( new HBox( {
        spacing: 10,
        children: [
          interactiveMeasuringTapeIcon,
          interactiveStopwatchNodeIcon,
          interactiveWaveMeterIcon
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
 * Initialize the icon for use in the toolbox. Returns an InteractiveHighlightingNode so that the icon shows
 * mouse and touch highlights for accessibility to indicate that these components are interactive.
 * @param node
 * @param inPlayAreaProperty
 * @param down
 */
const initializeIcon = ( node, inPlayAreaProperty, down ) => {
  const interactiveIcon = new InteractiveHighlightingNode( {
    children: [ node ],
    cursor: 'pointer'
  } );

  inPlayAreaProperty.link( inPlayArea => { interactiveIcon.visible = !inPlayArea; } );
  interactiveIcon.addInputListener( DragListener.createForwardingListener( down ) );

  return interactiveIcon;
};

waveInterference.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;
