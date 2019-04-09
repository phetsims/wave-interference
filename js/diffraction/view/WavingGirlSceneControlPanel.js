// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for the WavingGirlScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionNumberControl = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionNumberControl' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Panel = require( 'SUN/Panel' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const degreesValueString = require( 'string!WAVE_INTERFERENCE/degreesValue' );
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const rotationString = require( 'string!WAVE_INTERFERENCE/rotation' );

  class WavingGirlSceneControlPanel extends Panel {

    /**
     * @param {WavingGirlScene} wavingGirlScene
     * @param {Object} [options]
     */
    constructor( wavingGirlScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( heightString, wavingGirlScene.heightProperty, {
            numberDisplayOptions: {
              valuePattern: nmValueString
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 50 )
            }
          } ),
          new DiffractionNumberControl( rotationString, wavingGirlScene.rotationProperty, {
            delta: 1,
            numberDisplayOptions: { // TODO: duplicated in many places
              valuePattern: degreesValueString
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 30 ), // degrees
              majorTicks: [ {
                value: wavingGirlScene.rotationProperty.range.min,
                label: new WaveInterferenceText( wavingGirlScene.rotationProperty.range.min )
              }, {
                value: wavingGirlScene.rotationProperty.range.max,
                label: new WaveInterferenceText( '360' )
              } ]
            }
          } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'WavingGirlSceneControlPanel', WavingGirlSceneControlPanel );
} );