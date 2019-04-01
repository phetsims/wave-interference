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
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
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
          new DiffractionNumberControl( heightString,
            wavingGirlScene.heightProperty.range.min,
            wavingGirlScene.heightProperty.range.max,
            wavingGirlScene.heightProperty ),
          new DiffractionNumberControl( rotationString,
            wavingGirlScene.rotationProperty.range.min,
            wavingGirlScene.rotationProperty.range.max,
            wavingGirlScene.rotationProperty, {
              delta: 0.01,
              sliderOptions: {
                majorTicks: [ {
                  value: wavingGirlScene.rotationProperty.range.min,
                  label: new WaveInterferenceText( wavingGirlScene.rotationProperty.range.min )
                }, {
                  value: wavingGirlScene.rotationProperty.range.max,
                  label: new WaveInterferenceText( '360˚' )
                } ]
              }
            } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'WavingGirlSceneControlPanel', WavingGirlSceneControlPanel );
} );