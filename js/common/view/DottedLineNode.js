// Copyright 2018, University of Colorado Boulder

/**
 * When the graph is selected, the dotted line is shown in the center of the WaveAreaNode and in the center
 * of the graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  var SPACING = 16.2;
  var DASH_LENGTH = 16.2;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DottedLineNode( options ) {

    // Render as an HBox of Rectangle so that each dash can have its own stroke
    HBox.call( this, _.extend( {
      spacing: SPACING,
      children: _.times( WaveInterferenceConstants.WAVE_AREA_WIDTH / ( DASH_LENGTH + SPACING ), function() {
        return new Rectangle( 0, 0, DASH_LENGTH, 4, { fill: 'white', stroke: 'black', lineWidth: 1 } );
      } )
    }, options ) );
  }

  waveInterference.register( 'DottedLineNode', DottedLineNode );

  return inherit( HBox, DottedLineNode );
} );