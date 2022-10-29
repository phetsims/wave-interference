// Copyright 2018-2022, University of Colorado Boulder

/**
 * Keeps track of the history of wave values on the right edge of the visible wave area, for displaying intensity in
 * the LightScreenNode and IntensityGraphPanel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import waveInterference from '../../waveInterference.js';
import Lattice from '../../../../scenery-phet/js/Lattice.js';

// constants
// Number of samples to use for a temporal average.  Higher number means more latency and smoother. Lower number means
// lower latency, but more bouncy.
const HISTORY_LENGTH = 90;

class IntensitySample {

  // signifies when the intensitySample has changed values.
  public readonly changedEmitter = new Emitter();

  // each element is one output column
  public readonly history: number[][] = [];

  public constructor( private readonly lattice: Lattice ) {
    this.clear();
  }

  /**
   * Gets the intensity values of the rightmost column in the visible wave area.
   */
  public getIntensityValues(): number[] {
    const intensities = [];
    for ( let i = 0; i < this.history[ 0 ].length; i++ ) {
      let sum = 0;
      for ( let k = 0; k < this.history.length; k++ ) {

        // squared for intensity, see https://physics.info/intensity/
        sum = sum + this.history[ k ][ i ] * this.history[ k ][ i ];
      }
      intensities.push( sum / this.history.length );
    }

    const averagedIntensities = [];
    averagedIntensities.length = intensities.length;

    // End points only have one neighbor, so they get a 2-point average
    averagedIntensities[ 0 ] = ( intensities[ 0 ] + intensities[ 1 ] ) / 2;
    averagedIntensities[ averagedIntensities.length - 1 ] =
      ( intensities[ averagedIntensities.length - 1 ] + intensities[ averagedIntensities.length - 2 ] ) / 2;

    // Interior points average over self + both neighbors
    for ( let i = 1; i < intensities.length - 1; i++ ) {
      averagedIntensities[ i ] = ( intensities[ i - 1 ] + intensities[ i ] + intensities[ i + 1 ] ) / 3;
    }
    return averagedIntensities;
  }

  /**
   * Removes all data, used when resetting or changing scenes.
   */
  public clear(): void {
    this.history.length = 0;
    this.step(); // populate with one column
  }

  /**
   * Update the intensity samples when the lattice has updated.
   */
  public step(): void {
    this.history.push( this.lattice.getOutputColumn() );
    if ( this.history.length > HISTORY_LENGTH ) {
      this.history.shift();
    }
    this.changedEmitter.emit();
  }
}

waveInterference.register( 'IntensitySample', IntensitySample );
export default IntensitySample;