// Copyright 2018-2019, University of Colorado Boulder

/**
 * Controls the separation of the sources for each Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const cmValueString = require( 'string!WAVE_INTERFERENCE/cmValue' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const separationString = require( 'string!WAVE_INTERFERENCE/separation' );

  class SeparationControl extends ToggleNode {

    /**
     * @param {InterferenceModel} model
     */
    constructor( model ) {

      // Ranges, deltas, etc specified in https://github.com/phetsims/wave-interference/issues/177
      const waterSeparationProperty = model.waterScene.desiredSourceSeparationProperty;
      const soundSeparationProperty = model.soundScene.sourceSeparationProperty;
      const lightSeparationProperty = model.lightScene.sourceSeparationProperty;

      const waterSceneRange = waterSeparationProperty.range;
      const soundSceneRange = soundSeparationProperty.range;
      const lightSceneRange = lightSeparationProperty.range;
      const allRanges = [ waterSceneRange, soundSceneRange, lightSceneRange ];

      const createMuteOptions = scene => {
        return {
          startCallback: () => scene.setMuted( true ),
          endCallback: () => scene.setMuted( false ),
          leftStart: () => scene.setMuted( true ),
          leftEnd: () => scene.setMuted( false ),
          rightStart: () => scene.setMuted( true ),
          rightEnd: () => scene.setMuted( false )
        };
      };

      // Switch between controls for each scene.  No advantage in using SceneToggleNode in this case
      // because the control constructor calls are substantially different.
      super( model.sceneProperty, [ {
        value: model.waterScene,
        node: new NumberControl( separationString, waterSeparationProperty, waterSceneRange, merge( {
          delta: 0.1,
          numberDisplayOptions: {
            valuePattern: cmValueString,
            decimalPlaces: 1
          },
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 0.5 ),
            majorTicks: createTicks( waterSceneRange, allRanges )
          }
        }, createMuteOptions( model.waterScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      }, {
        value: model.soundScene,
        node: new NumberControl( separationString, soundSeparationProperty, soundSceneRange, merge( {
          delta: 1,
          numberDisplayOptions: { valuePattern: cmValueString },
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 10 ),
            majorTicks: createTicks( soundSceneRange, allRanges )
          }
        }, createMuteOptions( model.soundScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      }, {
        value: model.lightScene,
        node: new NumberControl( separationString, lightSeparationProperty, lightSceneRange, merge( {
          delta: 10,
          numberDisplayOptions: { valuePattern: nmValueString },
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 100 ),
            majorTicks: createTicks( lightSceneRange, allRanges )
          }
        }, createMuteOptions( model.lightScene ), WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) )
      } ] );
    }
  }


  /**
   * Create a label for a NumberControl tick.  The labels have the same bounds for each slider so
   * they don't jitter when changing scenes, see https://github.com/phetsims/wave-interference/issues/214
   * @param {string} string - the string to display
   * @param {string[]} allStrings - the strings for each scene, for layout
   * @returns {Node}
   */
  const createTickMarkLabel = ( string, allStrings ) => {
    const textNodes = allStrings.map( s => new WaveInterferenceText( s, {
        fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
        maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH,
        visible: s === string,
        centerX: 0
      } )
    );
    return new Node( { children: textNodes } );
  };

  /**
   * Create the min and max ticks for a NumberControl
   * @param {Range} range
   * @param {Range[]} allRanges - to ensure consistent layout across scenes
   * @returns {Object} to be used with numberTicks option of NumberControl
   */
  const createTicks = ( range, allRanges ) => [
    { value: range.min, label: createTickMarkLabel( range.min, allRanges.map( r => r.min ) ) },
    { value: range.max, label: createTickMarkLabel( range.max, allRanges.map( r => r.max ) ) }
  ];

  return waveInterference.register( 'SeparationControl', SeparationControl );
} );