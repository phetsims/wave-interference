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

  // strings
  var separationString = require( 'string!WAVE_INTERFERENCE/separation' );

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreenView( model, alignGroup ) {
    WavesScreenView.call( this, model, alignGroup, {

      // Remove pulse option from Interference screen, because it is distracting and does not meet a specific learning
      // goal.  The pulse/continuous radio buttons are used in other screens
      showPulseContinuousRadioButtons: false,
      controlPanelOptions: {
        additionalControl: new NumberControl( separationString, model.sourceSeparationProperty, new Range( 0, 50 ), _.extend( {
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