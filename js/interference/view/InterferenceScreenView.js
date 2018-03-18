// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the "Interference" screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Range = require( 'DOT/Range' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/common/view/WavesScreenView' );

  /**
   * @constructor
   */
  function InterferenceScreenView( model ) {
    WavesScreenView.call( this, model, {
      controlPanelOptions: {

        // TODO: this additional control can throw off the layout between screens.  We should use a shared AlignGroup across screens
        // as was done in Circuit Construction Kit
        additionalControl: new NumberControl( 'Separation', model.sourceSeparationProperty, new Range( 0, 50 ), _.extend( {
          majorTicks: [
            { value: 0, label: new WaveInterferenceText( 1000, { fontSize: 10 } ) },
            { value: 50, label: new WaveInterferenceText( 5000, { fontSize: 10 } ) } ]
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      }
    } );
  }

  waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );

  return inherit( WavesScreenView, InterferenceScreenView );
} );