// Copyright 2018-2026, University of Colorado Boulder

/**
 * Valid values for StringUnionProperty instances that represent the viewpoint. The wave area can be viewed from the
 * 'top' or from the 'side', and the view animates between the selections.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const ViewpointValues = [ 'top', 'side' ] as const;

/**
 * Represents whether the wave area is viewed from the top or the side.
 */
export type Viewpoint = typeof ViewpointValues[number];
