// Copyright 2018-2020, University of Colorado Boulder

/**
 * Creates a set of uniformly-sized icons for each of the scenes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import speakerImage from '../../../images/speaker/speaker_MID_png.js';
import waveInterference from '../../waveInterference.js';
import LightWaveGeneratorNode from './LightWaveGeneratorNode.js';

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


waveInterference.register( 'WaveInterferenceSceneIcons', WaveInterferenceSceneIcons );
export default WaveInterferenceSceneIcons;