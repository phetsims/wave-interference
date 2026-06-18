// Copyright 2018-2026, University of Colorado Boulder

/**
 * Valid values for StringUnionProperty instances that represent the barrier state. The wave area can contain a
 * barrier with one slit ('oneSlit'), two slits ('twoSlits'), or no barrier at all ('noBarrier').
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const BarrierTypeValues = [ 'noBarrier', 'oneSlit', 'twoSlits' ] as const;

/**
 * Represents whether the wave area has no barrier, a single-slit barrier, or a double-slit barrier.
 */
export type BarrierType = typeof BarrierTypeValues[number];
