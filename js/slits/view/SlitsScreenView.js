// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the Slits screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/common/view/WavesScreenView' );
  var SlitsControlPanel = require( 'WAVE_INTERFERENCE/slits/view/SlitsControlPanel' );

  /**
   * @constructor
   */
  function SlitsScreenView( model ) {
    WavesScreenView.call( this, model );

    // The Slits screen has an additional control panel below the main control panel, which controls the barrier/slits
    var slitControlPanel = new SlitsControlPanel( this.controlPanelAlignGroup, model, this, {
      left: this.controlPanel.left,
      top: this.controlPanel.bottom + WavesScreenView.SPACING
    } );
    this.addChild( slitControlPanel );
  }

  waveInterference.register( 'SlitsScreenView', SlitsScreenView );

  return inherit( WavesScreenView, SlitsScreenView );
} );