// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * When selected, shows discrete and moving particles for the sound view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import { Bounds2 } from '../../../../dot/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import SoundParticleNode from './SoundParticleNode.js';
import WavesModel from '../../waves/model/WavesModel.js';

// constants
// Render at increased resolution so particles don't appear pixellated on a large screen.  See Node.rasterized's
// resolution option for details about this value.
const RESOLUTION = 2;

class SoundParticleCanvasLayer extends CanvasNode {

  public constructor( model: WavesModel, waveAreaNodeBounds: Bounds2, options: CanvasNodeOptions ) {

    options = merge( {

      // only use the visible part for the bounds (not the damping regions).  Additionally erode so the particles
      // don't leak over the edge of the wave area
      canvasBounds: waveAreaNodeBounds.eroded( 5 ),
      layerSplit: true // ensure we're on our own layer
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

    // At the end of each model step, update all of the particles as a batch.
    const update = () => {
      if ( model.sceneProperty.value === model.soundScene ) {
        this.invalidatePaint();
      }
    };
    model.stepEmitter.addListener( update );
    model.sceneProperty.link( update );
  }

  /**
   * Draws into the canvas.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    context.transform( 1 / RESOLUTION, 0, 0, 1 / RESOLUTION, 0, 0 );
    for ( let i = 0; i < this.model.soundScene.soundParticles.length; i++ ) {
      const soundParticle = this.model.soundScene.soundParticles[ i ];

      // Red particles are shown on a grid
      const isRed = ( soundParticle.i % 4 === 2 && soundParticle.j % 4 === 2 );
      const sphereImage = isRed ? this.redSphereImage : this.whiteSphereImage;

      context.drawImage(
        sphereImage,
        RESOLUTION * ( this.model.soundScene.modelViewTransform.modelToViewX( soundParticle.x ) ) - sphereImage.width / 2,
        RESOLUTION * ( this.model.soundScene.modelViewTransform.modelToViewY( soundParticle.y ) ) - sphereImage.height / 2
      );
    }
  }
}

waveInterference.register( 'SoundParticleCanvasLayer', SoundParticleCanvasLayer );
export default SoundParticleCanvasLayer;