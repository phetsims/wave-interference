// Copyright 2018-2022, University of Colorado Boulder

/**
 * This node is used for layout only.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class WaveAreaNode extends Rectangle {

  public constructor( options?: RectangleOptions ) {
    super( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, WaveInterferenceConstants.WAVE_AREA_WIDTH, merge( {

      // This node is used for layout, so don't include a stroke which could throw off the dimensions
      // Show the background color required for the sound scene, when the lattice is hidden
      fill: '#4c4c4c'
    }, options ) );
  }
}

waveInterference.register( 'WaveAreaNode', WaveAreaNode );
export default WaveAreaNode;