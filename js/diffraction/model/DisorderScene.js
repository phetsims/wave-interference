// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a single rectangular aperture.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class DisorderScene extends DiffractionScene {

    constructor() {

      const diameterProperty = new NumberProperty( 500, {
        range: new Range( 0, 1000 )
      } );
      const latticeSpacingProperty = new NumberProperty( 0, {
        range: new Range( 0, 1000 )
      } );
      const disorderProperty = new NumberProperty( 0, {
        range: new Range( 0, 4 )
      } );
      super( [ diameterProperty, latticeSpacingProperty, disorderProperty ] );

      // @public {NumberProperty}
      this.diameterProperty = diameterProperty;

      // @public {NumberProperty}
      this.latticeSpacingProperty = latticeSpacingProperty;

      // @public {NumberProperty}
      this.disorderProperty = disorderProperty;
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {
      assert && assert( matrix.getRowDimension() % 2 === 0, 'matrix should be even' );
      assert && assert( matrix.getColumnDimension() % 2 === 0, 'matrix should be even' );

      /**
       * Tick Mark  Cell [row, column]  x-displacement  y-displacement  Eccentricity
       2  [1, 2]  0%  -45%  --
       2  [1, 4]  -35%  -45%  --
       2  [2, 3]  10%  0%  --
       2  [3, 4]  30%  40%  --

       3  [1, 1]  -50%  -70%  45%-y
       3  [1, 3]  40%  0%  --
       3  [3, 2]  0%  -60%  --
       3  [4, 1]  -40%  -45%  40%-y

       4  [2, 1]  55%  55%  --
       4  [3, 1]  -55%  -45%  45%-x
       4  [4, 3]  35%  45%  50%-x
       4  [4, 4]  -65%  60%  --

       5  [2, 2]  -75%  -65%  70%-y
       5  [2, 4]  65%  65%  60%-y
       5  [3, 3]  60%  -75%  50%-x
       5  [4, 2]  -60%  70%  75%-x
       */
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

      const points = [];
      for ( let i = 0; i < array.length; i++ ) {
        const arrayElement = array[ i ];
        for ( let j = 0; j < arrayElement.length; j++ ) {
          const entry = arrayElement[ j ];

          const isDisordered = this.disorderProperty.value >= i;
          let position = entry.cell;
          let scalePercent = new Vector2( 100, 100 );
          if ( isDisordered ) {
            position = position.plusXY( entry.offsetPercent.x / 300, entry.offsetPercent.y / 300 );
            scalePercent = entry.scalePercent;
          }
          points.push( { center: position, scalePercent: scalePercent } );
        }
      }

      const latticeSpacing = this.latticeSpacingProperty.value;
      const edgePoint = Util.linear( 0, 1000, matrix.getColumnDimension() / 4, matrix.getColumnDimension() / 6, latticeSpacing );

      const diameter = Util.linear( 0, 1000, 0, 10, this.diameterProperty.value );

      // TODO: paint is getting called twice for every value change. This is a performance problem.
      // TODO: you can see this by console.logging each paint.  Oh, there is one call to paint for the view and one for
      // TODO: the scaled model

      // clear since every cell is not set in the loop
      matrix.timesEquals( 0 );

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {
          for ( let pointIndex = 0; pointIndex < points.length; pointIndex++ ) {

            const point = points[ pointIndex ];
            const scalePercent = point.scalePercent;
            const x0 = Util.roundSymmetric( Util.linear( 2.5, 1, matrix.getColumnDimension() / 2, edgePoint, point.center.x ) );
            const y0 = Util.roundSymmetric( Util.linear( 2.5, 1, matrix.getRowDimension() / 2, edgePoint, point.center.y ) );

            const rx = diameter;
            const rx2 = rx * rx * scaleFactor * scalePercent.x / 100;
            const ry2 = rx * rx * scaleFactor * scalePercent.y / 100;

            const dx = ( x - x0 );
            const dy = ( y - y0 );

            // Ellipse equation: (x-h)^2 /rx^2  + (y-k)^2/ry^2 <=1
            const ellipseValue = dx * dx / rx2 + dy * dy / ry2;

            if ( ellipseValue < 1 ) {
              matrix.set( y, x, 1 );

              // Bail as soon as overlapping one ellipse to avoid extra work
              break;
            }
          }
        }
      }
    }
  }

  return waveInterference.register( 'DisorderScene', DisorderScene );
} );