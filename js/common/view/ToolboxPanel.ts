// Copyright 2018-2026, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import InstanceRegistry from '../../../../phet-core/js/documentation/InstanceRegistry.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import InteractiveHighlightingNode from '../../../../scenery/js/accessibility/voicing/nodes/InteractiveHighlightingNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';
import WaveMeterNode from './WaveMeterNode.js';

class ToolboxPanel extends WaveInterferencePanel {

  public constructor( measuringTapeNode: MeasuringTapeNode, stopwatchNode: StopwatchNode, waveMeterNode: WaveMeterNode, alignGroup: AlignGroup, isMeasuringTapeInPlayAreaProperty: Property<boolean>,
                      measuringTapeTipPositionProperty: TReadOnlyProperty<Vector2>, stopwatch: Stopwatch, isWaveMeterInPlayAreaProperty: Property<boolean> ) {

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
    stopwatch.isVisibleProperty.value = true;
    const stopwatchNodeIcon = rasterizeNode( stopwatchNode ).mutate( { scale: 0.45 } );
    stopwatch.isVisibleProperty.value = false;

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    const interactiveStopwatchNodeIcon = initializeIcon( stopwatchNodeIcon, stopwatch.isVisibleProperty, event => {
      stopwatchNode.center = this.globalToParentPoint( event.pointer.point );

      // stopwatchNode provided as targetNode in the DragListener constructor, so this press will target it
      stopwatchNode.dragListener!.press( event );
      stopwatch.isVisibleProperty.value = true;
    } );

    // Make sure the probes have enough breathing room so they don't get shoved into the WaveMeterNode icon.  Anything
    // above 60 seems to work equally well, closer than that causes the probes to overlap each other or the meter
    // body. The true translation is set when dragged out of the toolbox.
    waveMeterNode.backgroundNode.translate( 60, 0 );

    // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
    // Temporarily show the node so it can be rasterized for an icon
    isWaveMeterInPlayAreaProperty.value = true;
    const waveMeterIcon = rasterizeNode( waveMeterNode ).mutate( { scale: 0.25 } );
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

    // Alternative input: pressing an icon button with the keyboard (Space/Enter) deploys the tool to a default
    // position in the play area and moves focus to it. Pressing Escape while a deployed tool (or its focusable
    // descendants) has focus returns the tool to the toolbox and restores focus to the icon. This mirrors the
    // pointer-based drag-out / drop-in-toolbox interaction. The deploy position is computed relative to the toolbox
    // so it stays in the play area regardless of layout.

    // Measuring tape: deploy at its reset (default) position, which is in the play area, and focus its base handle.
    interactiveMeasuringTapeIcon.addInputListener( new KeyboardListener( {
      fireOnClick: true,
      fire: () => {
        if ( !isMeasuringTapeInPlayAreaProperty.value ) {
          measuringTapeNode.basePositionProperty.reset();
          measuringTapeNode.tipPositionProperty.reset();
          isMeasuringTapeInPlayAreaProperty.value = true;

          // Move focus to the deployed measuring tape (its base handle).
          const focusable = measuringTapeNode.getSubtreeNodes().reverse().find( node => node.focusable );
          focusable && focusable.focus();
        }
      }
    } ) );
    measuringTapeNode.addInputListener( new KeyboardListener( {
      keys: [ 'escape' ],
      fire: () => {
        if ( isMeasuringTapeInPlayAreaProperty.value ) {
          isMeasuringTapeInPlayAreaProperty.value = false;
          measuringTapeNode.basePositionProperty.reset();
          measuringTapeNode.tipPositionProperty.reset();
          interactiveMeasuringTapeIcon.focus();
        }
      }
    } ) );

    // Stopwatch: deploy to the left of the toolbox (into the play area) and focus it.
    interactiveStopwatchNodeIcon.addInputListener( new KeyboardListener( {
      fireOnClick: true,
      fire: () => {
        if ( !stopwatch.isVisibleProperty.value ) {
          stopwatch.positionProperty.value = this.leftCenter.plusXY( -stopwatchNode.width - 40, 120 );
          stopwatch.isVisibleProperty.value = true;
          stopwatchNode.focus();
        }
      }
    } ) );
    stopwatchNode.addInputListener( new KeyboardListener( {
      keys: [ 'escape' ],
      fire: () => {
        if ( stopwatch.isVisibleProperty.value ) {
          stopwatch.reset();
          interactiveStopwatchNodeIcon.focus();
        }
      }
    } ) );

    // Wave meter: deploy to the left of the toolbox (into the play area), align its probes to the body, and focus the
    // chart body.
    interactiveWaveMeterIcon.addInputListener( new KeyboardListener( {
      fireOnClick: true,
      fire: () => {
        if ( !isWaveMeterInPlayAreaProperty.value ) {
          waveMeterNode.synchronizeProbePositions = true;
          waveMeterNode.backgroundNode.setTranslation( this.leftCenter.plusXY( -waveMeterNode.backgroundNode.width - 60, 80 ) );
          isWaveMeterInPlayAreaProperty.value = true;
          waveMeterNode.alignProbesEmitter.emit();
          waveMeterNode.synchronizeProbePositions = false;
          waveMeterNode.backgroundNode.focus();
        }
      }
    } ) );

    // Escape is added to the whole wave meter (not just the body) so it also fires when a probe has focus.
    waveMeterNode.addInputListener( new KeyboardListener( {
      keys: [ 'escape' ],
      fire: () => {
        if ( isWaveMeterInPlayAreaProperty.value ) {
          waveMeterNode.reset();
          isWaveMeterInPlayAreaProperty.value = false;
          interactiveWaveMeterIcon.focus();
        }
      }
    } ) );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerToolbox( this );
  }
}

/**
 * Initialize the icon for use in the toolbox. Returns an InteractiveHighlightingNode so that the icon shows
 * mouse and touch highlights for accessibility to indicate that these components are interactive.
 * @param node
 * @param inPlayAreaProperty
 * @param down
 */
const initializeIcon = ( node: Node, inPlayAreaProperty: TReadOnlyProperty<boolean>, down: ( event: PressListenerEvent ) => void ): InteractiveHighlightingNode => {
  const interactiveIcon = new InteractiveHighlightingNode( {
    children: [ node ],
    cursor: 'pointer',

    // Focusable button for alternative input; pressing it deploys the corresponding tool (see the KeyboardListeners
    // wired up in the constructor). The accessible name is added in a later slice.
    tagName: 'button'
  } );

  inPlayAreaProperty.link( inPlayArea => { interactiveIcon.visible = !inPlayArea; } );
  interactiveIcon.addInputListener( DragListener.createForwardingListener( down ) );

  return interactiveIcon;
};

export default ToolboxPanel;
