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
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SoundParticleLayer extends CanvasNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {

      options = _.extend( {

        // only use the visible part for the bounds (not the damping regions)
        canvasBounds: waveAreaNodeBounds,
        layerSplit: true // ensure we're on our own layer
      }, options );

      super( options );
      this.model = model;
      this.modelViewTransform = ModelViewTransform2.createRectangleMapping( model.soundScene.getWaveAreaBounds(), waveAreaNodeBounds );

      const toImage = color => new ShadedSphereNode( 10, {
        mainColor: color,
        stroke: 'black'
      } ).rasterized( {
        useCanvas: true
      } ).children[ 0 ].image;
      this.whiteSphereImage = toImage( 'rgb(210,210,210)' );
      this.redSphereImage = toImage( 'red' );

      // At the end of each model step, update all of the particles as a batch.
      const updateIfSoundScene = () => {
        if ( model.sceneProperty.value === model.soundScene ) {
          this.invalidatePaint();
        }
      };
      model.stepEmitter.addListener( updateIfSoundScene );
      model.sceneProperty.link( updateIfSoundScene );
    }

    /**
     * Draws into the canvas.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas( context ) {
      this.model.soundScene.soundParticles.forEach( soundParticle => {
        const isRed = ( soundParticle.i % 4 === 2 && soundParticle.k % 4 === 2 );
        const image = isRed ? this.redSphereImage : this.whiteSphereImage;
        context.drawImage(
          image,
          this.modelViewTransform.modelToViewX( soundParticle.x ) - image.width / 2,
          this.modelViewTransform.modelToViewY( soundParticle.y ) - image.height / 2
        );
      } );
    }
  }

  return waveInterference.register( 'SoundParticleLayer', SoundParticleLayer );
} );