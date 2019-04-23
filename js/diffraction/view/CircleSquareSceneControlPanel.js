// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for the CircleSquareScene.
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
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // strings
  const circleDiameterString = require( 'string!WAVE_INTERFERENCE/circleDiameter' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const squareWidthString = require( 'string!WAVE_INTERFERENCE/squareWidth' );

  // constants
  const constrained = WaveInterferenceUtils.constrained;

  class CircleSquareSceneControlPanel extends Panel {

    /**
     * @param {CircleSquareScene} circleSquareScene
     * @param {Object} [options]
     */
    constructor( circleSquareScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( circleDiameterString, circleSquareScene.circleDiameterProperty, {
            delta: 50 * 1E-3,
            numberDisplayOptions: {
              valuePattern: nmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 10 * 1E-3 )
            }
          } ),
          new DiffractionNumberControl( squareWidthString, circleSquareScene.squareWidthProperty, {
            delta: 50 * 1E-3,
            numberDisplayOptions: {
              valuePattern: nmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 10 * 1E-3 )
            }
          } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'CircleSquareSceneControlPanel', CircleSquareSceneControlPanel );
} );