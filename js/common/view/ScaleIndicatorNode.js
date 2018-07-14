// Copyright 2018, University of Colorado Boulder

/**
 * Appears above the lattice and shows the scale, like this:
 * |<------>| 500 nanometers
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const DoubleHeadedArrowWithBarsNode = require( 'WAVE_INTERFERENCE/common/view/DoubleHeadedArrowWithBarsNode' );

  /**
   * @param {Scene} scene
   * @param {number} latticeViewWidth
   * @param {Object} [options]
   * @constructor
   */
  function ScaleIndicatorNode( scene, latticeViewWidth, options ) {

    const width = scene.scaleIndicatorLength * latticeViewWidth / scene.waveAreaWidth;
    const text = new WaveInterferenceText( scene.scaleIndicatorText );

    const doubleHeadedArrowWithBars = new DoubleHeadedArrowWithBarsNode( text.height, width );
    text.leftCenter = doubleHeadedArrowWithBars.rightCenter.plusXY( 5, 1 );

    Node.call( this, _.extend( {
      children: [ doubleHeadedArrowWithBars, text ]
    }, options ) );
  }

  waveInterference.register( 'ScaleIndicatorNode', ScaleIndicatorNode );

  return inherit( Node, ScaleIndicatorNode );
} );