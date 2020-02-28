// Copyright 2018-2020, University of Colorado Boulder

/**
 * For the sound scene, shows one speaker for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import speakerL10Image from '../../../images/speaker/speaker_L10_png.js';
import speakerL1Image from '../../../images/speaker/speaker_L1_png.js';
import speakerL2Image from '../../../images/speaker/speaker_L2_png.js';
import speakerL3Image from '../../../images/speaker/speaker_L3_png.js';
import speakerL4Image from '../../../images/speaker/speaker_L4_png.js';
import speakerL5Image from '../../../images/speaker/speaker_L5_png.js';
import speakerL6Image from '../../../images/speaker/speaker_L6_png.js';
import speakerL7Image from '../../../images/speaker/speaker_L7_png.js';
import speakerL8Image from '../../../images/speaker/speaker_L8_png.js';
import speakerL9Image from '../../../images/speaker/speaker_L9_png.js';
import speakerImageMID from '../../../images/speaker/speaker_MID_png.js';
import speakerR10Image from '../../../images/speaker/speaker_R10_png.js';
import speakerR1Image from '../../../images/speaker/speaker_R1_png.js';
import speakerR2Image from '../../../images/speaker/speaker_R2_png.js';
import speakerR3Image from '../../../images/speaker/speaker_R3_png.js';
import speakerR4Image from '../../../images/speaker/speaker_R4_png.js';
import speakerR5Image from '../../../images/speaker/speaker_R5_png.js';
import speakerR6Image from '../../../images/speaker/speaker_R6_png.js';
import speakerR7Image from '../../../images/speaker/speaker_R7_png.js';
import speakerR8Image from '../../../images/speaker/speaker_R8_png.js';
import speakerR9Image from '../../../images/speaker/speaker_R9_png.js';
import waveInterference from '../../waveInterference.js';
import SoundScene from '../model/SoundScene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveGeneratorNode from './WaveGeneratorNode.js';

// variables
const speakers = [
  speakerL10Image,
  speakerL9Image,
  speakerL8Image,
  speakerL7Image,
  speakerL6Image,
  speakerL5Image,
  speakerL4Image,
  speakerL3Image,
  speakerL2Image,
  speakerL1Image,
  speakerImageMID,
  speakerR1Image,
  speakerR2Image,
  speakerR3Image,
  speakerR4Image,
  speakerR5Image,
  speakerR6Image,
  speakerR7Image,
  speakerR8Image,
  speakerR9Image,
  speakerR10Image
];

class SoundWaveGeneratorNode extends WaveGeneratorNode {

  /**
   * @param {SoundScene} soundScene
   * @param {Node} waveAreaNode - for bounds
   * @param {boolean} isPrimarySource
   */
  constructor( soundScene, waveAreaNode, isPrimarySource ) {
    assert && assert( soundScene instanceof SoundScene, 'soundScene should be an instance of SoundScene' );
    const image = new Image( speakerImageMID, {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      scale: 0.75
    } );
    super( soundScene, waveAreaNode, 42, isPrimarySource, image );
    const modelProperty = isPrimarySource ? soundScene.oscillator1Property :
                          soundScene.oscillator2Property;
    modelProperty.link( oscillator1 => {

      const max = soundScene.amplitudeProperty.range.max * WaveInterferenceConstants.AMPLITUDE_CALIBRATION_SCALE;

      // Sign is chosen so that the membrane forward corresponds to a high pressure outside the speaker,
      // see https://github.com/phetsims/wave-interference/issues/178
      const interpolated = Utils.linear( -max, max, 0, speakers.length - 1, oscillator1 );
      const index = Utils.roundSymmetric( interpolated );
      image.image = speakers[ index ];
    } );
  }
}

waveInterference.register( 'SoundWaveGeneratorNode', SoundWaveGeneratorNode );
export default SoundWaveGeneratorNode;