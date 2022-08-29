// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * When selected, shows discrete and moving particles for the sound view.
 * Note: Clipping is not enabled on mobileSafari, see https://github.com/phetsims/wave-interference/issues/322
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import { Bounds2 } from '../../../../dot/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import SoundParticleNode from './SoundParticleNode.js';
import WavesModel from '../../waves/model/WavesModel.js';

class SoundParticleImageLayer extends Node {

  public constructor( model: WavesModel, waveAreaNodeBounds: Bounds2, options?: NodeOptions ) {

    options = merge( {

      layerSplit: true, // ensure we're on our own layer
      renderer: 'webgl'
    }, options );

    super( options );

    // @private
    this.model = model;

    SoundParticleNode.createForCanvas( WaveInterferenceConstants.SOUND_PARTICLE_GRAY_COLOR, canvas => {

      // @private {HTMLCanvasElement} - assigned synchronously and is guaranteed to exist after createSphereImage
      this.whiteSphereImage = canvas;
    } );

    SoundParticleNode.createForCanvas( WaveInterferenceConstants.SOUND_PARTICLE_RED_COLOR, canvas => {

      // @private {HTMLCanvasElement} - assigned synchronously and is guaranteed to exist after createSphereImage
      this.redSphereImage = canvas;
    } );

    const images = [];

    // At the end of each model step, update all of the particles as a batch.
    const update = () => {
      if ( model.sceneProperty.value === model.soundScene ) {
        for ( let i = 0; i < images.length; i++ ) {
          images[ i ].update();
        }
      }
    };
    model.stepEmitter.addListener( update );
    model.sceneProperty.link( update );

    for ( let i = 0; i < this.model.soundScene.soundParticles.length; i++ ) {
      const soundParticle = this.model.soundScene.soundParticles[ i ];

      // Red particles are shown on a grid
      const isRed = ( soundParticle.i % 4 === 2 && soundParticle.j % 4 === 2 );
      const sphereImage = isRed ? this.redSphereImage : this.whiteSphereImage;

      const soundParticleImage = new SoundParticleImage( soundParticle, sphereImage, this.model.soundScene.modelViewTransform );
      images.push( soundParticleImage );
      this.addChild( soundParticleImage );
    }
    update();
  }
}

class SoundParticleImage extends Image {
  public constructor( soundParticle, image, modelViewTransform ) {
    super( image, { scale: 0.5 } );
    this.soundParticle = soundParticle;
    this.image = image;
    this.modelViewTransform = modelViewTransform;
  }

  public update(): void {
    const x = ( this.modelViewTransform.modelToViewX( this.soundParticle.x ) ) - this.width / 2;
    const y = ( this.modelViewTransform.modelToViewY( this.soundParticle.y ) ) - this.height / 2;
    this.setTranslation( x, y );
  }
}

waveInterference.register( 'SoundParticleImageLayer', SoundParticleImageLayer );
export default SoundParticleImageLayer;