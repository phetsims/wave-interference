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
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class RectangleScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.widthProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 400, 8000 )
      } );

      // @public {NumberProperty}
      this.heightProperty = new NumberProperty( WaveInterferenceConstants.DEFAULT_WAVELENGTH, {
        range: new Range( 400, 8000 )
      } );

      this.properties = [ this.widthProperty, this.heightProperty ];
    }

    /**
     * Add our pattern to the matrix.
     *
     * @param {Matrix} matrix
     * @param {number} scaleFactor - zoom factor to account for frequency difference
     * @public
     */
    paintMatrix( matrix, scaleFactor ) {

      const modelToMatrixScale = WaveInterferenceConstants.DIFFRACTION_MODEL_TO_MATRIX_SCALE;

      // TODO: n will always be even as power of 2, so is this OK?
      const centerRow = Util.roundSymmetric( matrix.getRowDimension() / 2 );
      const centerColumn = Util.roundSymmetric( matrix.getColumnDimension() / 2 );
      const columnRadius = Util.roundSymmetric( this.widthProperty.value * modelToMatrixScale * scaleFactor / 2 );
      const rowRadius = Util.roundSymmetric( this.heightProperty.value * modelToMatrixScale * scaleFactor / 2 );

      // clear since every cell is not set in the loop
      matrix.timesEquals( 0 );

      for ( let column = centerColumn - columnRadius; column <= centerColumn + columnRadius; column++ ) {
        for ( let row = centerRow - rowRadius; row <= centerRow + rowRadius; row++ ) {
          matrix.set( row, column, 1 );
        }
      }
    }
  }

  return waveInterference.register( 'RectangleScene', RectangleScene );
} );