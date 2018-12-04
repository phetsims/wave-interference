// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the "Interference" screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Range = require( 'DOT/Range' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  // strings
  const cmValueString = require( 'string!WAVE_INTERFERENCE/cmValue' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const separationString = require( 'string!WAVE_INTERFERENCE/separation' );

  class InterferenceScreenView extends WavesScreenView {

    /**
     * @param {WavesScreenModel} model
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( model, alignGroup ) {

      const toLabel = string => new WaveInterferenceText( string, {
        fontSize: 10,
        maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
      } );
      const waterSceneRange = new Range( 1, 5 ); // cm
      const soundSceneRange = new Range( 100, 400 ); // cm
      const lightSceneRange = new Range( 500, 4000 ); // nm
      const createTicks = ( range, unitsString ) => [
        { value: range.min, label: toLabel( range.min ) },
        { value: range.max, label: toLabel( range.max ) }
      ];
      const waterSeparationProperty = model.waterScene.desiredSourceSeparationProperty;
      const soundSeparationProperty = model.soundScene.sourceSeparationProperty;
      const lightSeparationProperty = model.lightScene.sourceSeparationProperty;

      // Switch between controls for each scene.  No advantage in using SceneToggleNode in this case
      // because the control constructor calls are substantially different.
      const toggleNode = new ToggleNode( model.sceneProperty, [ {
        value: model.waterScene,
        node: new NumberControl( separationString, waterSeparationProperty, waterSceneRange, _.extend( {
          delta: 0.1,
          valuePattern: cmValueString,
          decimalPlaces: 1,
          constrainValue: function( value ) { return Util.roundToInterval( value, 0.5 ); },
          majorTicks: createTicks( waterSceneRange, cmValueString )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      }, {
        value: model.soundScene,
        node: new NumberControl( separationString, soundSeparationProperty, soundSceneRange, _.extend( {
          delta: 1,
          valuePattern: cmValueString,
          constrainValue: function( value ) { return Util.roundToInterval( value, 10 ); },
          majorTicks: createTicks( soundSceneRange, cmValueString )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      }, {
        value: model.lightScene,
        node: new NumberControl( separationString, lightSeparationProperty, lightSceneRange, _.extend( {
          delta: 10,
          valuePattern: nmValueString,
          constrainValue: function( value ) { return Util.roundToInterval( value, 100 ); },
          majorTicks: createTicks( lightSceneRange, nmValueString )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      } ] );
      super( model, alignGroup, {

        // The pulse option does not appear in the Interference screen, because it is distracting and does not meet a
        // specific learning goal in this context.
        showPulseContinuousRadioButtons: false,
        controlPanelOptions: {
          showAmplitudeSlider: false,
          additionalControl: toggleNode
        }
      } );
    }
  }

  return waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );
} );