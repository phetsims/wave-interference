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

  // strings
  const circleDiameterString = require( 'string!WAVE_INTERFERENCE/circleDiameter' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const squareWidthString = require( 'string!WAVE_INTERFERENCE/squareWidth' );

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
            numberDisplayOptions: {
              valuePattern: nmValueString
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 20 )
            }
          } ),
          new DiffractionNumberControl( squareWidthString, circleSquareScene.squareWidthProperty, {
            numberDisplayOptions: {
              valuePattern: nmValueString
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 20 ) // TODO: factor out
            }
          } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'CircleSquareSceneControlPanel', CircleSquareSceneControlPanel );
} );