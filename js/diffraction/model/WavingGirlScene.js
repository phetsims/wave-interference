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
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const wavingGirlShape = new Shape( 'M31.769,1.91c6.404,0,11.594,5.191,11.594,11.595S38.173,25.1,31.769,25.1s-11.595-5.191-11.595-11.595\n' +
                                     '\tS25.365,1.91,31.769,1.91z M55.387,84.578L38.434,57.425V28.922H25.105v28.503L8.152,84.578H55.387z M22.439,89.964h6.397v18.126\n' +
                                     '\th-6.397V89.964z M34.701,89.964h6.396v18.126h-6.396V89.964z M7.027,35.853v-9.064H1.429v9.064v6.13v2.399h18.659v-8.529H7.027z\n' +
                                     '\t M1.917,17.28h4.621v4.621H1.917V17.28z M61.268,42.681l-7.027-7.787v-0.08H41.919v9.479H54.17v3.106l-7.77,7.879l3.545,3.494\n' +
                                     '\tl13.625-13.82L61.268,42.681z' );

  class WavingGirlScene extends DiffractionScene {

    constructor() {
      super( [] );
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

      for ( let x = 0; x <= matrix.getColumnDimension(); x++ ) {
        for ( let y = 0; y <= matrix.getRowDimension(); y++ ) {

          const contained = wavingGirlShape.containsPoint( new Vector2( x, y ) );

          matrix.set( y, x, contained ? 1 : 0 );
        }
      }
    }
  }

  return waveInterference.register( 'WavingGirlScene', WavingGirlScene );
} );