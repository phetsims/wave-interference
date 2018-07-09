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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  // strings
  var cmValueString = require( 'string!WAVE_INTERFERENCE/cmValue' );
  var nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  var separationString = require( 'string!WAVE_INTERFERENCE/separation' );

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreenView( model, alignGroup ) {

    var createLabelText = function( string ) {
      return new WaveInterferenceText( string, { fontSize: 10 } );
    };

    var toggleNode = new ToggleNode( [ {
      value: model.waterScene,
      node: new NumberControl( separationString, model.waterScene.sourceSeparationProperty, new Range( 1, 5 ), _.extend( {
        delta: 1,
        valuePattern: cmValueString,
        decimalPlaces: 0,
        majorTicks: [
          { value: 1, label: createLabelText( StringUtils.format( cmValueString, 1 ) ) },
          { value: 5, label: createLabelText( StringUtils.format( cmValueString, 5 ) ) } ]
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.soundScene,
      node: new NumberControl( separationString, model.soundScene.sourceSeparationProperty, new Range( 10, 50 ), _.extend( {
        delta: 10,
        valuePattern: cmValueString,
        majorTicks: [
          { value: 10, label: createLabelText( StringUtils.format( cmValueString, 10 ) ) },
          { value: 50, label: createLabelText( StringUtils.format( cmValueString, 50 ) ) } ]
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
    }, {
      value: model.lightScene,
      node: new NumberControl( separationString, model.lightScene.sourceSeparationProperty, new Range( 500, 2500 ), _.extend( {
        delta: 500,
        valuePattern: nmValueString,
        majorTicks: [
          { value: 500, label: createLabelText( StringUtils.format( nmValueString, 500 ) ) },
          { value: 2500, label: createLabelText( StringUtils.format( nmValueString, 2500 ) ) } ]
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