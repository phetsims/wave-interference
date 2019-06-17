// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for the RectangleScene.
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

  // strings
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const mmValueString = require( 'string!WAVE_INTERFERENCE/mmValue' );
  const widthString = require( 'string!WAVE_INTERFERENCE/width' );

  class RectangleSceneControlPanel extends WaveInterferencePanel {

    /**
     * @param {RectangleScene} rectangleScene
     * @param {Object} [options]
     */
    constructor( rectangleScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( widthString, rectangleScene.widthProperty, {
            delta: 10 * 1E-3,
            numberDisplayOptions: {
              valuePattern: mmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 20E-3 )
            }
          } ),
          new DiffractionNumberControl( heightString, rectangleScene.heightProperty, {
            delta: 10 * 1E-3,
            numberDisplayOptions: {
              valuePattern: mmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 20E-3 )
            }
          } ) ]
      } ), options );
    }
  }

  return waveInterference.register( 'RectangleSceneControlPanel', RectangleSceneControlPanel );
} );