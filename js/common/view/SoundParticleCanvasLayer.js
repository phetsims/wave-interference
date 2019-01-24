// Copyright 2018, University of Colorado Boulder

/**
 * When selected, shows discrete and moving particles for the sound view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );

  // constants
  // Render at increased resolution so particles don't appear pixellated on a large screen.  See Node.rasterized's
  // resolution option for details about this value.
  const RESOLUTION = 2;

  class SoundParticleCanvasLayer extends CanvasNode {

    /**
     * @param {WavesModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {

      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions).  Additionally erode so the particles
        // don't leak over the edge of the wave area
        canvasBounds: waveAreaNodeBounds.eroded( 5 ),
        layerSplit: true // ensure we're on our own layer
      }, options );

      super( options );

      // @private
      this.model = model;

      createSphereImage( 'rgb(210,210,210)', canvas => {

        // @private {HTMLCanvasElement} - assigned synchronously and is guaranteed to exist after createSphereImage
        this.whiteSphereImage = canvas;
      } );

      createSphereImage( 'red', canvas => {

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
     * @param {CanvasRenderingContext2D} context
     * @public
     * @override
     */
    paintCanvas( context ) {
      if ( WaveInterferenceQueryParameters.skipSoundParticlesRender ) {
        return;
      }
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

  /**
   * Create an image of a ShadedSphereNode for the given color.
   * @param {ColorDef} color
   * @param {function} callback, see Node.toCanvas for signature
   * @returns {HTMLCanvasElement}
   */
  const createSphereImage = ( color, callback ) => new ShadedSphereNode( 10, {
    mainColor: color,
    stroke: 'black',
    scale: 2
  } ).toCanvas( callback );

  return waveInterference.register( 'SoundParticleCanvasLayer', SoundParticleCanvasLayer );
} );