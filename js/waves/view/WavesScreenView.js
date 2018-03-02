// Copyright 2018, University of Colorado Boulder

/**
 * View for the "Waves" screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var ViewRadioButtonGroup = require( 'WAVE_INTERFERENCE/waves/view/ViewRadioButtonGroup' );

  // constants
  var MARGIN = 6;
  var CONTROL_PANEL_X = ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.75;

  /**
   * @param {WavesScreenModel} model
   * @constructor
   */
  function WavesScreenView( model ) {
    ScreenView.call( this );

    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN
    } );
    this.addChild( resetAllButton );

    var viewRadioButtonGroup = new ViewRadioButtonGroup( model.viewTypeProperty, {
      bottom: resetAllButton.top - MARGIN,
      left: CONTROL_PANEL_X
    } );
    this.addChild( viewRadioButtonGroup );
  }

  waveInterference.register( 'WavesScreenView', WavesScreenView );

  return inherit( ScreenView, WavesScreenView );
} );