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
  const LightEmitterNode = require( 'WAVE_INTERFERENCE/common/view/LightEmitterNode' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const speakerImage = require( 'image!WAVE_INTERFERENCE/speaker/speaker_MID.png' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceSceneIcons {
    constructor() {

      // @public {FaucetNode} - Faucet icon, rasterized to clip out invisible parts (like the ShooterNode)
      this.faucetIcon = new FaucetNode( 1, new NumberProperty( 0 ), new BooleanProperty( true ), {
        interactiveProperty: new BooleanProperty( false )
      } ).rasterized();

      // @public - Speaker icon
      this.speakerIcon = new Image( speakerImage );

      // @public - Laser Pointer icon
      this.laserPointerIcon = new LaserPointerNode( new BooleanProperty( false ), LightEmitterNode.DEFAULT_OPTIONS );

      // Uniform sizing.
      const iconWidth = 26;
      this.faucetIcon.scale( iconWidth / this.faucetIcon.width * 0.7 );
      this.speakerIcon.scale( iconWidth / this.speakerIcon.height );
      this.laserPointerIcon.scale( iconWidth / this.laserPointerIcon.width );
    }
  }

  return waveInterference.register( 'WaveInterferenceSceneIcons', WaveInterferenceSceneIcons );
} );