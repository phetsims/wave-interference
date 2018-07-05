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
  var ToggleNode = require( 'SUN/ToggleNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  // strings
  var separationString = require( 'string!WAVE_INTERFERENCE/separation' );

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreenView( model, alignGroup ) {

    // TODO: Source separation units are wrong (tick labels and readout), and values need to change when scene changes
    var toggleNode = new ToggleNode( [ {
      value: model.waterScene,
      node: new NumberControl( separationString, model.sourceSeparationProperty, new Range( 0.01, 0.05 ), _.extend( {
        delta: 0.01,

        // TODO: We need the NumberControl to read out in cm, not in meters.
        decimalPlaces: 2,
        majorTicks: [
          { value: 0.01, label: new WaveInterferenceText( '1 cm', { fontSize: 10 } ) },
          { value: 0.05, label: new WaveInterferenceText( '5 cm', { fontSize: 10 } ) } ]
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.soundScene,
      node: new NumberControl( separationString, model.sourceSeparationProperty, new Range( 0.1, 0.5 ), _.extend( {
        delta: 0.1,
        majorTicks: [
          { value: 0.1, label: new WaveInterferenceText( '10 cm', { fontSize: 10 } ) },
          { value: 0.5, label: new WaveInterferenceText( '50 cm', { fontSize: 10 } ) } ]
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.lightScene,
      node: new NumberControl( separationString, model.sourceSeparationProperty, new Range( 500E-9, 2500E-9 ), _.extend( {
        delta: 500E-9,
        majorTicks: [
          { value: 500E-9, label: new WaveInterferenceText( '500 nm', { fontSize: 10 } ) },
          { value: 2500E-9, label: new WaveInterferenceText( '2500 nm', { fontSize: 10 } ) } ]
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    } ], model.sceneProperty );
    WavesScreenView.call( this, model, alignGroup, {

      // The pulse option does not appear in the Interference screen, because it is distracting and does not meet a
      // specific learning goal in this context.
      showPulseContinuousRadioButtons: false,
      controlPanelOptions: {
        additionalControl: toggleNode
      }
    } );
  }

  waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );

  return inherit( WavesScreenView, InterferenceScreenView );
} );