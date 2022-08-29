// Copyright 2019-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * This scene shows a controllable discrete amount of disorder in the aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import DiffractionScene from './DiffractionScene.js';

// The disorder is quantized over the following levels.  The perturbations are cumulative, so that level N contains
// all the perturbations declared in level N-1 as well as its new perturbations.  Each individual perturbation contains:
// cell:          {Vector2} - indicating the position in the grid to perturb
// offsetPercent: {Vector2} - indicating the relative percentages to move the point
// scalePercent:  {Vector2} - indicating x and y scale factors, or 100% if unscaled in that direction.
const array = [

  // No perturbations at the 1st tick
  [],

  // 2nd tick
  [ { cell: new Vector2( 1, 2 ), offsetPercent: new Vector2( 0, -45 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 1, 4 ), offsetPercent: new Vector2( -35, -45 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 2, 3 ), offsetPercent: new Vector2( 10, 0 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 3, 4 ), offsetPercent: new Vector2( 30, 40 ), scalePercent: new Vector2( 100, 100 ) } ],

  // 3rd tick
  [ { cell: new Vector2( 1, 1 ), offsetPercent: new Vector2( -50, -70 ), scalePercent: new Vector2( 100, 45 ) },
    { cell: new Vector2( 1, 3 ), offsetPercent: new Vector2( 40, 0 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 3, 2 ), offsetPercent: new Vector2( 10, -60 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 4, 1 ), offsetPercent: new Vector2( -40, -45 ), scalePercent: new Vector2( 100, 40 ) } ],

  // 4th tick
  [ { cell: new Vector2( 2, 1 ), offsetPercent: new Vector2( 55, 55 ), scalePercent: new Vector2( 100, 100 ) },
    { cell: new Vector2( 3, 1 ), offsetPercent: new Vector2( -55, -45 ), scalePercent: new Vector2( 45, 100 ) },
    { cell: new Vector2( 4, 3 ), offsetPercent: new Vector2( 35, 45 ), scalePercent: new Vector2( 50, 100 ) },
    { cell: new Vector2( 4, 4 ), offsetPercent: new Vector2( -65, 60 ), scalePercent: new Vector2( 100, 100 ) } ],

  // 5th tick
  [ { cell: new Vector2( 2, 2 ), offsetPercent: new Vector2( -75, -65 ), scalePercent: new Vector2( 100, 70 ) },
    { cell: new Vector2( 2, 4 ), offsetPercent: new Vector2( 65, 65 ), scalePercent: new Vector2( 100, 60 ) },
    { cell: new Vector2( 3, 3 ), offsetPercent: new Vector2( 60, -75 ), scalePercent: new Vector2( 60, 100 ) },
    { cell: new Vector2( 4, 2 ), offsetPercent: new Vector2( -60, 70 ), scalePercent: new Vector2( 75, 100 ) } ]
];

class DisorderScene extends DiffractionScene {

  public constructor() {

    const diameterProperty = new NumberProperty( 50E-3, {
      range: new Range( 10E-3, 100E-3 ),
      units: 'mm'
    } );

    const latticeSpacingProperty = new NumberProperty( 100 * 1E-3, {
      range: new Range( 50 * 1E-3, 200 * 1E-3 ),
      units: 'mm'
    } );

    const disorderProperty = new NumberProperty( 0, {
      range: new Range( 0, 4 )
    } );

    super( [ diameterProperty, latticeSpacingProperty, disorderProperty ] );

    // @public {NumberProperty} - diameter in mm
    this.diameterProperty = diameterProperty;

    // @public {NumberProperty} - lattice spacing in mm
    this.latticeSpacingProperty = latticeSpacingProperty;

    // @public {NumberProperty} - amount of disorder (unitless)
    this.disorderProperty = disorderProperty;
  }

  /**
   * Render the aperture shape(s) to the canvas context.
   */
  protected override renderToContext( context: CanvasRenderingContext2D ): void {
    const points = [];
    for ( let i = 0; i < array.length; i++ ) {
      const arrayElement = array[ i ];
      for ( let j = 0; j < arrayElement.length; j++ ) {
        const entry = arrayElement[ j ];

        const isDisordered = this.disorderProperty.value >= i;
        let position = entry.cell;
        let scalePercent = new Vector2( 100, 100 );
        if ( isDisordered ) {
          position = position.plusXY( entry.offsetPercent.x / 100, entry.offsetPercent.y / 100 );
          scalePercent = entry.scalePercent;
        }
        points.push( { center: position, scalePercent: scalePercent } );
      }
    }

    const latticeSpacing = this.latticeSpacingProperty.value;

    // Spacing in matrix coordinates.
    const matrixSpacing = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE * latticeSpacing;

    const WIDTH = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
    const radius = this.diameterProperty.value * WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE / 2;

    context.beginPath();
    for ( let pointIndex = 0; pointIndex < points.length; pointIndex++ ) {
      const point = points[ pointIndex ];
      const scalePercent = point.scalePercent;

      // 2.5 is the center of 1,2,3,4 and 3.5 is one cell over.
      const x0 = Utils.roundSymmetric( Utils.linear( 2.5, 3.5, WIDTH / 2, WIDTH / 2 + matrixSpacing, point.center.x ) );
      const y0 = Utils.roundSymmetric( Utils.linear( 2.5, 3.5, WIDTH / 2, WIDTH / 2 + matrixSpacing, point.center.y ) );

      const rx2 = radius * radius * scalePercent.x / 100;
      const ry2 = radius * radius * scalePercent.y / 100;

      // Don't connect the ellipses
      context.moveTo( x0, y0 );

      if ( context.ellipse ) {
        context.ellipse( x0, y0, Math.sqrt( rx2 ), Math.sqrt( ry2 ), 0, 0, Math.PI * 2 );
      }
      else {

        // context.ellipse is not supported on IE11, see https://github.com/phetsims/wave-interference/issues/424
        // In that case, render as a scaled circle.  Similar to EllipticalArc.js
        context.save();
        context.translate( x0, y0 );
        context.scale( Math.sqrt( rx2 ), Math.sqrt( ry2 ) );
        context.arc( 0, 0, 1, 0, Math.PI * 2 );
        context.restore();
      }
    }
    context.fill();
  }
}

waveInterference.register( 'DisorderScene', DisorderScene );
export default DisorderScene;