// Copyright 2018, University of Colorado Boulder

/**
 * Creates a set of uniformly-sized icons for each of the scenes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const LightWaveGeneratorNode = require( 'WAVE_INTERFERENCE/common/view/LightWaveGeneratorNode' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const speakerImage = require( 'image!WAVE_INTERFERENCE/speaker/speaker_MID.png' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const WaveInterferenceSceneIcons = {

    // @public - Faucet icon, rasterized to clip out invisible parts (like the ShooterNode)
    WATER_ICON: new FaucetNode( 1, new NumberProperty( 0 ), new BooleanProperty( true ), {
      interactiveProperty: new BooleanProperty( false )
    } ).rasterized(),

    // @public
    SOUND_ICON: new Image( speakerImage ),

    // @public
    LIGHT_ICON: new LaserPointerNode( new BooleanProperty( false ), LightWaveGeneratorNode.DEFAULT_OPTIONS )
  };

  // Icon sizes
  const waterIconWidth = 20.3;
  const iconWidth = 29;
  WaveInterferenceSceneIcons.WATER_ICON.scale( waterIconWidth / WaveInterferenceSceneIcons.WATER_ICON.width );
  WaveInterferenceSceneIcons.SOUND_ICON.scale( iconWidth / WaveInterferenceSceneIcons.SOUND_ICON.height );
  WaveInterferenceSceneIcons.LIGHT_ICON.scale( iconWidth / WaveInterferenceSceneIcons.LIGHT_ICON.width );

  return waveInterference.register( 'WaveInterferenceSceneIcons', WaveInterferenceSceneIcons );
} );