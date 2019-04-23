// Copyright 2018-2019, University of Colorado Boulder

/**
 * Convenience class for the radio button group that chooses between SoundScene.SoundViewType.VALUES.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SoundScene = require( 'WAVE_INTERFERENCE/common/model/SoundScene' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const bothString = require( 'string!WAVE_INTERFERENCE/both' );
  const particlesString = require( 'string!WAVE_INTERFERENCE/particles' );
  const wavesString = require( 'string!WAVE_INTERFERENCE/waves' );

  class SoundViewTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {WavesModel} model
     */
    constructor( model ) {
      super( [ {
        node: new WaveInterferenceText( wavesString ),
        value: SoundScene.SoundViewType.WAVES,
        property: model.soundScene.soundViewTypeProperty
      }, {
        node: new WaveInterferenceText( particlesString ),
        value: SoundScene.SoundViewType.PARTICLES,
        property: model.soundScene.soundViewTypeProperty
      }, {
        node: new WaveInterferenceText( bothString ),
        value: SoundScene.SoundViewType.BOTH,
        property: model.soundScene.soundViewTypeProperty
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