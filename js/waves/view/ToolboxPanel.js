// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, stopwatch, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );

  /**
   * @param {AlignGroup} alignGroup - to align with neighbors
   * @param {Object} [options]
   * @constructor
   */
  function ToolboxPanel( alignGroup, options ) {
    WaveInterferencePanel.call( this,
      alignGroup.createBox( new HBox( {
        spacing: 10,
        children: [
          new WaveInterferenceText( 'Tape' ),
          new WaveInterferenceText( 'Watch' ),
          new WaveInterferenceText( 'Probe' )
        ]
      } ) ),
      options
    );
  }

  waveInterference.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( WaveInterferencePanel, ToolboxPanel );
} );