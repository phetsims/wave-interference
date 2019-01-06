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

  class WaveInterferenceSceneIcons {
    constructor() {

      // @public - Faucet icon, rasterized to clip out invisible parts (like the ShooterNode)
      this.waterIcon = new FaucetNode( 1, new NumberProperty( 0 ), new BooleanProperty( true ), {
        interactiveProperty: new BooleanProperty( false )
      } ).rasterized();

      // @public
      this.soundIcon = new Image( speakerImage );

      // @public
      this.lightIcon = new LaserPointerNode( new BooleanProperty( false ), LightWaveGeneratorNode.DEFAULT_OPTIONS );

      // Icon sizes
      const waterIconWidth = 20.3;
      const iconWidth = 29;
      this.waterIcon.scale( waterIconWidth / this.waterIcon.width );
      this.soundIcon.scale( iconWidth / this.soundIcon.height );
      this.lightIcon.scale( iconWidth / this.lightIcon.width );
    }
  }


  return waveInterference.register( 'WaveInterferenceSceneIcons', WaveInterferenceSceneIcons );
} );