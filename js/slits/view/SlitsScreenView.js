// Copyright 2018, University of Colorado Boulder

/**
 *
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

    var slitControlPanel = new SlitsControlPanel( this.controlPanelAlignGroup, model, this, {
      left: this.controlPanel.left,
      top: this.controlPanel.bottom + WavesScreenView.SPACING
    } );
    this.addChild( slitControlPanel );
  }

  waveInterference.register( 'SlitsScreenView', SlitsScreenView );

  return inherit( WavesScreenView, SlitsScreenView );
} );