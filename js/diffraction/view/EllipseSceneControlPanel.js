// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for the EllipseScene.
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
  const diameterString = require( 'string!WAVE_INTERFERENCE/diameter' );
  const eccentricityString = require( 'string!WAVE_INTERFERENCE/eccentricity' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );

  class EllipseSceneControlPanel extends Panel {

    /**
     * @param {EllipseScene} ellipseScene
     * @param {Object} [options]
     */
    constructor( ellipseScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( diameterString,
            ellipseScene.diameterProperty.range.min,
            ellipseScene.diameterProperty.range.max,
            ellipseScene.diameterProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ),
          new DiffractionNumberControl( eccentricityString,
            ellipseScene.eccentricityProperty.range.min,
            ellipseScene.eccentricityProperty.range.max,
            ellipseScene.eccentricityProperty, {
              delta: 0.01,
              numberDisplayOptions: {
                decimalPlaces: 2
              }
            } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'EllipseSceneControlPanel', EllipseSceneControlPanel );
} );