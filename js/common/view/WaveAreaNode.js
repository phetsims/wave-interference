// Copyright 2018-2020, University of Colorado Boulder

/**
 * This node is used for layout only.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class WaveAreaNode extends Rectangle {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, merge( {

      // This node is used for layout, so don't include a stroke which could throw off the dimensions
      // Show the background color required for the sound scene, when the lattice is hidden
      fill: '#4c4c4c'
    }, options ) );
  }
}

waveInterference.register( 'WaveAreaNode', WaveAreaNode );
export default WaveAreaNode;