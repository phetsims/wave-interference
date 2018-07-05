// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the "Interference" screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Property = require( 'AXON/Property' );
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

    // For water and sound, the NumberControl reads out in cm
    var cmProperty = new DynamicProperty( new Property( model.sourceSeparationProperty ), {
      bidirectional: true,
      map: function( x ) {return x * 100;},
      inverseMap: function( x ) {return x / 100;}
    } );

    // For light, the NumberControl reads out in nm
    var nmProperty = new DynamicProperty( new Property( model.sourceSeparationProperty ), {
      bidirectional: true,
      map: function( x ) {return x * 1E9;},
      inverseMap: function( x ) {return x / 1E9;}
    } );

    // TODO: See SlitsControlPanel.  Should we factor out a pattern for this?
    var toggleNode = new ToggleNode( [ {
      value: model.waterScene,
      node: new NumberControl( separationString, cmProperty, new Range( 1, 5 ), _.extend( {
        delta: 1,
        valuePattern: '{0} cm', // TODO: i18n
        decimalPlaces: 0,
        majorTicks: [
          { value: 1, label: new WaveInterferenceText( '1 cm', { fontSize: 10 } ) }, // TODO: i18n
          { value: 5, label: new WaveInterferenceText( '5 cm', { fontSize: 10 } ) } ] // TODO: i18n
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.soundScene,
      node: new NumberControl( separationString, cmProperty, new Range( 10, 50 ), _.extend( {
        delta: 10,
        valuePattern: '{0} cm', // TODO: i18n
        majorTicks: [
          { value: 10, label: new WaveInterferenceText( '10 cm', { fontSize: 10 } ) }, // TODO: i18n
          { value: 50, label: new WaveInterferenceText( '50 cm', { fontSize: 10 } ) } ] // TODO: i18n
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.lightScene,
      node: new NumberControl( separationString, nmProperty, new Range( 500, 2500 ), _.extend( {
        delta: 500,
        valuePattern: '{0} nm', // TODO: i18n
        majorTicks: [
          { value: 500, label: new WaveInterferenceText( '500 nm', { fontSize: 10 } ) }, // TODO: i18n
          { value: 2500, label: new WaveInterferenceText( '2500 nm', { fontSize: 10 } ) } ] // TODO: i18n
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