// Copyright 2018-2020, University of Colorado Boulder

/**
 * When the graph is selected, this dashed line is shown in the center of the WaveAreaNode and in the graph's center.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import LineStyles from '../../../../kite/js/util/LineStyles.js';
import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';

class DashedLineNode extends Path {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    const line = Shape.lineSegment( 0, 0, WaveInterferenceConstants.WAVE_AREA_WIDTH, 0 );
    const dashedShape = line.getDashedShape( [ 16 ], 0 );
    const strokedShape = dashedShape.getStrokedShape( new LineStyles( {
      lineWidth: 4,
      lineCap: 'round'
    } ) );

    super( strokedShape, merge( {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    }, options ) );
  }
}

waveInterference.register( 'DashedLineNode', DashedLineNode );
export default DashedLineNode;