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
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const degreesValueString = require( 'string!WAVE_INTERFERENCE/degreesValue' );
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const mmValueString = require( 'string!WAVE_INTERFERENCE/mmValue' );
  const rotationString = require( 'string!WAVE_INTERFERENCE/rotation' );

  class WavingGirlSceneControlPanel extends WaveInterferencePanel {

    /**
     * @param {WavingGirlScene} wavingGirlScene
     * @param {Object} [options]
     */
    constructor( wavingGirlScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        align: 'bottom',
        children: [
          new DiffractionNumberControl( heightString, wavingGirlScene.heightProperty, {
            delta: 10 * 1E-3,
            numberDisplayOptions: {
              valuePattern: mmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 20E-3 )
            }
          } ),
          new DiffractionNumberControl( rotationString, wavingGirlScene.rotationProperty, {
            numberDisplayOptions: {
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