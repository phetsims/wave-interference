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
  const Panel = require( 'SUN/Panel' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // strings
  const circleDiameterString = require( 'string!WAVE_INTERFERENCE/circleDiameter' );
  const diamondDiameterString = require( 'string!WAVE_INTERFERENCE/diamondDiameter' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );

  class CircleDiamondSceneControlPanel extends Panel {

    /**
     * @param {CircleDiamondScene} circleDiamondScene
     * @param {Object} [options]
     */
    constructor( circleDiamondScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( circleDiameterString,
            circleDiamondScene.circleDiameterProperty.range.min,
            circleDiamondScene.circleDiameterProperty.range.max,
            circleDiamondScene.circleDiameterProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ),

          // TODO (design): Should this be "square diameter"
          new DiffractionNumberControl( diamondDiameterString,
            circleDiamondScene.diamondDiameterProperty.range.min,
            circleDiamondScene.diamondDiameterProperty.range.max,
            circleDiamondScene.diamondDiameterProperty, {
              delta: 0.01,
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'CircleDiamondSceneControlPanel', CircleDiamondSceneControlPanel );
} );