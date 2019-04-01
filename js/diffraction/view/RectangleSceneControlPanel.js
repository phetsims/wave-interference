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

  // strings
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const widthString = require( 'string!WAVE_INTERFERENCE/width' );

  class RectangleSceneControlPanel extends Panel {

    /**
     * @param {RectangleScene} rectangleScene
     * @param {number} spacing
     * @param {Object} [options]
     */
    constructor( rectangleScene, spacing, options ) {
      super( new HBox( {
        spacing: spacing,
        children: [
          new DiffractionNumberControl( widthString,
            rectangleScene.widthProperty.range.min,
            rectangleScene.widthProperty.range.max,
            rectangleScene.widthProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ),
          new DiffractionNumberControl( heightString,
            rectangleScene.heightProperty.range.min,
            rectangleScene.heightProperty.range.max,
            rectangleScene.heightProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ) ]
      } ), options );
    }
  }

  return waveInterference.register( 'RectangleSceneControlPanel', RectangleSceneControlPanel );
} );