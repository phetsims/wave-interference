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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var DoubleHeadedArrowWithBarsNode = require( 'WAVE_INTERFERENCE/common/view/DoubleHeadedArrowWithBarsNode' );

  /**
   * @param {WavesScreenModel} model
   * @param {number} latticeViewWidth
   * @param {Object} [options]
   * @constructor
   */
  function ScaleIndicatorNode( model, latticeViewWidth, options ) {

    var createNodes = function( scene ) {

      var width = scene.scaleIndicatorLength * latticeViewWidth / scene.latticeWidth;
      var text = new WaveInterferenceText( scene.scaleIndicatorText );

      var doubleHeadedArrowWithBars = new DoubleHeadedArrowWithBarsNode( text.height, width );
      text.leftCenter = doubleHeadedArrowWithBars.rightCenter.plusXY( 5, 1 );
      return [ doubleHeadedArrowWithBars, text ];
    };

    Node.call( this, _.extend( {
      children: createNodes( model.sceneProperty.get() )
    }, options ) );

    model.sceneProperty.lazyLink( createNodes );
  }

  waveInterference.register( 'ScaleIndicatorNode', ScaleIndicatorNode );

  return inherit( Node, ScaleIndicatorNode );
} );