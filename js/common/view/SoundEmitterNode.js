// Copyright 2018, University of Colorado Boulder

/**
 * For the sound scene, shows one speaker for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const Util = require( 'DOT/Util' );

  // images
  const speakerL10Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L10.png' );
  const speakerL9Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L9.png' );
  const speakerL8Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L8.png' );
  const speakerL7Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L7.png' );
  const speakerL6Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L6.png' );
  const speakerL5Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L5.png' );
  const speakerL4Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L4.png' );
  const speakerL3Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L3.png' );
  const speakerL2Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L2.png' );
  const speakerL1Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_L1.png' );
  const speakerImageMID = require( 'image!WAVE_INTERFERENCE/speaker/speaker_MID.png' );
  const speakerR1Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R1.png' );
  const speakerR2Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R2.png' );
  const speakerR3Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R3.png' );
  const speakerR4Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R4.png' );
  const speakerR5Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R5.png' );
  const speakerR6Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R6.png' );
  const speakerR7Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R7.png' );
  const speakerR8Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R8.png' );
  const speakerR9Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R9.png' );
  const speakerR10Image = require( 'image!WAVE_INTERFERENCE/speaker/speaker_R10.png' );

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

  class SoundEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( model, waveAreaNode, isPrimarySource ) {
      const image = new Image( speakerImageMID, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
        scale: 0.75
      } );
      super( model, model.soundScene, waveAreaNode, 42, isPrimarySource, image );
      model.oscillator1Property.link( oscillator1 => {

        const max = model.amplitudeProperty.range.max;

        // Sign is chosen so that the membrane moving to the left pulls particles in (in the particle view), and
        // membrane moving to the right pushes wave crests out.
        var interpolated = Util.linear( max, -max, 0, speakers.length - 1, oscillator1 );
        var index = Util.roundSymmetric( interpolated );
        image.image = speakers[ index ];
      } );
    }
  }

  return waveInterference.register( 'SoundEmitterNode', SoundEmitterNode );
} );