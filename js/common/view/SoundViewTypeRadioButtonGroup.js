// Copyright 2018, University of Colorado Boulder

/**
 * Convenience class for the radio button group that chooses between SoundViewTypeEnum.VALUES.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SoundViewTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SoundViewTypeEnum' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const particlesString = require( 'string!WAVE_INTERFERENCE/particles' );
  const bothString = require( 'string!WAVE_INTERFERENCE/both' );
  const wavesString = require( 'string!WAVE_INTERFERENCE/waves' );

  class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {
      super( [ {
        node: new WaveInterferenceText( wavesString ),
        value: SoundViewTypeEnum.WAVES,
        property: model.soundScene.viewSelectionProperty
      }, {
        node: new WaveInterferenceText( particlesString ),
        value: SoundViewTypeEnum.PARTICLES,
        property: model.soundScene.viewSelectionProperty
      }, {
        node: new WaveInterferenceText( bothString ),
        value: SoundViewTypeEnum.BOTH,
        property: model.soundScene.viewSelectionProperty
      } ], {
        spacing: 4,
        radioButtonOptions: {

          // Manually tuned so the radio buttons have the same width as the "Graph" checkbox
          radius: 6.5
        }
      } );
    }
  }

  return waveInterference.register( 'SoundViewTypeRadioButtonGroup', SoundViewTypeRadioButtonGroup );
} );