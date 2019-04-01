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
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const widthString = require( 'string!WAVE_INTERFERENCE/width' );

  class RectangleSceneControlPanel extends Panel {

    /**
     * @param {RectangleScene} rectangleScene
     * @param {Object} [options]
     */
    constructor( rectangleScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( widthString, rectangleScene.widthProperty, {
            numberDisplayOptions: {
              valuePattern: nmValueString
            }
          } ),
          new DiffractionNumberControl( heightString, rectangleScene.heightProperty, {
            numberDisplayOptions: {
              valuePattern: nmValueString
            }
          } ) ]
      } ), options );
    }
  }

  return waveInterference.register( 'RectangleSceneControlPanel', RectangleSceneControlPanel );
} );