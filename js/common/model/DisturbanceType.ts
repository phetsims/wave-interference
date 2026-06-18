// Copyright 2018-2026, University of Colorado Boulder

/**
 * Valid values for StringUnionProperty instances that represent the disturbance type. A wave can be a single
 * wavelength ('pulse') or ongoing ('continuous').
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const DisturbanceTypeValues = [ 'pulse', 'continuous' ] as const;

/**
 * Represents whether the wave generator emits a single pulse or a continuous wave.
 */
export type DisturbanceType = typeof DisturbanceTypeValues[number];
