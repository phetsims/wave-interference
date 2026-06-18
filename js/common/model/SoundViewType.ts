// Copyright 2018-2026, University of Colorado Boulder

/**
 * Valid values for StringUnionProperty instances that represent the sound view type. The sound scene can be displayed
 * as 'waves', 'particles', or 'both'.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const SoundViewTypeValues = [ 'waves', 'particles', 'both' ] as const;

/**
 * Represents whether the sound scene shows waves, particles, or both.
 */
export type SoundViewType = typeof SoundViewTypeValues[number];
