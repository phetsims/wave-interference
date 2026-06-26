// Copyright 2026, University of Colorado Boulder

/**
 * Helpers for playing the tambo boundary-reached ("bonk") sound when a draggable tool is clamped against the edge of
 * its drag bounds. There is no built-in boundary sound on the scenery-phet drag listeners, so each draggable watches
 * its (already clamped) position and fires a BoundaryReachedSoundPlayer on the rising edge of touching an edge.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import BoundaryReachedSoundPlayer from '../../../../tambo/js/BoundaryReachedSoundPlayer.js';

// Tolerance for "on the edge", far smaller than any real drag step but large enough to absorb floating-point
// differences between a clamped position and a separately computed bounds edge.
const BOUNDARY_EPSILON = 1e-6;

/**
 * Returns true if point lies on (or beyond) an edge of bounds. A position clamped to bounds lands on an edge, so this
 * effectively detects "was clamped." Set xOnly when only horizontal motion is constrained (e.g. the barrier).
 */
export const isPointOnBoundary = ( point: Vector2, bounds: Bounds2, xOnly = false ): boolean => {
  const onX = point.x <= bounds.minX + BOUNDARY_EPSILON || point.x >= bounds.maxX - BOUNDARY_EPSILON;
  const onY = point.y <= bounds.minY + BOUNDARY_EPSILON || point.y >= bounds.maxY - BOUNDARY_EPSILON;
  return xOnly ? onX : ( onX || onY );
};

/**
 * Wires a BoundaryReachedSoundPlayer to a draggable. The sound plays on the rising edge of isOnBoundary() becoming
 * true while the trigger Property changes. Pass draggingProperty to suppress the sound when the position is re-clamped
 * for reasons other than a user drag (layout changes, reset); it also clears the boundary state when a drag ends so the
 * next drag can re-trigger the sound.
 *
 * @param triggerProperty - re-evaluates isOnBoundary() whenever it changes (typically the tool's position Property)
 * @param isOnBoundary - returns whether the tool is currently against its boundary
 * @param [draggingProperty] - when provided, the sound only plays while this is true
 */
export const addBoundaryReachedSound = ( triggerProperty: TReadOnlyProperty<IntentionalAny>,
                                         isOnBoundary: () => boolean,
                                         draggingProperty?: TReadOnlyProperty<boolean> ): void => {
  const boundaryReachedSoundPlayer = new BoundaryReachedSoundPlayer();
  triggerProperty.lazyLink( () => {
    boundaryReachedSoundPlayer.setOnBoundary( ( !draggingProperty || draggingProperty.value ) && isOnBoundary() );
  } );
  draggingProperty && draggingProperty.lazyLink( dragging => {
    if ( !dragging ) {
      boundaryReachedSoundPlayer.setOnBoundary( false );
    }
  } );
};
