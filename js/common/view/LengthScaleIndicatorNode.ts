// Copyright 2018-2022, University of Colorado Boulder

/**
 * Appears above the lattice and shows the scale, like this:
 * |<------>| 500 nm
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceText from './WaveInterferenceText.js';

class LengthScaleIndicatorNode extends Node {

  /**
   * @param width - width of the indicator
   * @param string - text to display to the right of the indicator
   * @param [options]
   */
  public constructor( width: number, string: string, options?: NodeOptions ) {

    const text = new WaveInterferenceText( string, {
      font: WaveInterferenceConstants.TIME_AND_LENGTH_SCALE_INDICATOR_FONT
    } );

    const createBar = ( centerX: number ) => new Line( 0, 0, 0, text.height, { stroke: 'black', centerX: centerX } );
    const leftBar = createBar( -width / 2 );
    const rightBar = createBar( width / 2 );
    const arrowNode = new ArrowNode( leftBar.right + 1, leftBar.centerY, rightBar.left - 1, rightBar.centerY, {
      doubleHead: true,
      headHeight: 5,
      headWidth: 5,
      tailWidth: 2
    } );
    text.leftCenter = rightBar.rightCenter.plusXY( 5, 0 );

    super( merge( {
      children: [ arrowNode, leftBar, rightBar, text ]
    }, options ) );
  }
}

waveInterference.register( 'LengthScaleIndicatorNode', LengthScaleIndicatorNode );
export default LengthScaleIndicatorNode;