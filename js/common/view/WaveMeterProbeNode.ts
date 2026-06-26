// Copyright 2018-2026, University of Colorado Boulder

/**
 * One probe for the WaveMeterNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import BoundaryReachedSoundPlayer from '../../../../tambo/js/BoundaryReachedSoundPlayer.js';
import { isPointOnBoundary } from './WaveInterferenceBoundarySound.js';

type SelfOptions = {
  dragStart?: () => void;
  drag?: () => void;
};

type WaveMeterProbeNodeOptions = SelfOptions & ProbeNodeOptions;

class WaveMeterProbeNode extends InteractiveHighlighting( ProbeNode ) {

  /**
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param [providedOptions]
   */
  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions?: WaveMeterProbeNodeOptions ) {

    const options = optionize<WaveMeterProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
      cursor: 'pointer',
      sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
      scale: 0.4,
      dragStart: _.noop,
      drag: _.noop
    }, providedOptions );

    super( options );

    // Make the probe focusable and keyboard-draggable.
    this.mutate( AccessibleDraggableOptions );

    visibleBoundsProperty.link( visibleBounds => this.setCenter( visibleBounds.closestPointTo( this.center ) ) );

    // Plays the boundary-reached sound when the probe is dragged (pointer or keyboard) to the edge of the visible
    // bounds. The probe is translated by the listeners, so its translation is the clamped position.
    const boundaryReachedSoundPlayer = new BoundaryReachedSoundPlayer();
    const dragStart = () => {
      boundaryReachedSoundPlayer.setOnBoundary( false );
      options.dragStart();
    };
    const drag = () => {
      boundaryReachedSoundPlayer.setOnBoundary( isPointOnBoundary( this.translation, visibleBoundsProperty.value ) );
      options.drag();
    };

    this.addInputListener( new SoundDragListener( {
      translateNode: true,
      dragBoundsProperty: visibleBoundsProperty,
      start: dragStart,
      drag: drag
    } ) );

    this.addInputListener( new SoundKeyboardDragListener( {
      translateNode: true,
      dragBoundsProperty: visibleBoundsProperty,
      start: dragStart,
      drag: drag
    } ) );
  }
}

export default WaveMeterProbeNode;
