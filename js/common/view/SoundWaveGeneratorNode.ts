// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * For the sound scene, shows one speaker for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { Image } from '../../../../scenery/js/imports.js';
import speaker_L10_png from '../../../../scenery-phet/images/speaker/speaker_L10_png.js';
import speaker_L1_png from '../../../../scenery-phet/images/speaker/speaker_L1_png.js';
import speaker_L2_png from '../../../../scenery-phet/images/speaker/speaker_L2_png.js';
import speaker_L3_png from '../../../../scenery-phet/images/speaker/speaker_L3_png.js';
import speaker_L4_png from '../../../../scenery-phet/images/speaker/speaker_L4_png.js';
import speaker_L5_png from '../../../../scenery-phet/images/speaker/speaker_L5_png.js';
import speaker_L6_png from '../../../../scenery-phet/images/speaker/speaker_L6_png.js';
import speaker_L7_png from '../../../../scenery-phet/images/speaker/speaker_L7_png.js';
import speaker_L8_png from '../../../../scenery-phet/images/speaker/speaker_L8_png.js';
import speaker_L9_png from '../../../../scenery-phet/images/speaker/speaker_L9_png.js';
import speaker_MID_png from '../../../../scenery-phet/images/speaker/speaker_MID_png.js';
import speaker_R10_png from '../../../../scenery-phet/images/speaker/speaker_R10_png.js';
import speaker_R1_png from '../../../../scenery-phet/images/speaker/speaker_R1_png.js';
import speaker_R2_png from '../../../../scenery-phet/images/speaker/speaker_R2_png.js';
import speaker_R3_png from '../../../../scenery-phet/images/speaker/speaker_R3_png.js';
import speaker_R4_png from '../../../../scenery-phet/images/speaker/speaker_R4_png.js';
import speaker_R5_png from '../../../../scenery-phet/images/speaker/speaker_R5_png.js';
import speaker_R6_png from '../../../../scenery-phet/images/speaker/speaker_R6_png.js';
import speaker_R7_png from '../../../../scenery-phet/images/speaker/speaker_R7_png.js';
import speaker_R8_png from '../../../../scenery-phet/images/speaker/speaker_R8_png.js';
import speaker_R9_png from '../../../../scenery-phet/images/speaker/speaker_R9_png.js';
import waveInterference from '../../waveInterference.js';
import SoundScene from '../model/SoundScene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveGeneratorNode from './WaveGeneratorNode.js';
import WaveAreaNode from './WaveAreaNode.js';

// variables
const speakers = [
  speaker_L10_png,
  speaker_L9_png,
  speaker_L8_png,
  speaker_L7_png,
  speaker_L6_png,
  speaker_L5_png,
  speaker_L4_png,
  speaker_L3_png,
  speaker_L2_png,
  speaker_L1_png,
  speaker_MID_png,
  speaker_R1_png,
  speaker_R2_png,
  speaker_R3_png,
  speaker_R4_png,
  speaker_R5_png,
  speaker_R6_png,
  speaker_R7_png,
  speaker_R8_png,
  speaker_R9_png,
  speaker_R10_png
];

class SoundWaveGeneratorNode extends WaveGeneratorNode {

  public constructor( soundScene: SoundScene, waveAreaNode: WaveAreaNode, isPrimarySource: boolean ) {
    const image = new Image( speaker_MID_png, {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      scale: 0.75,
      renderer: 'canvas'
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