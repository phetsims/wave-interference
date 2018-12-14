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

  // constants
  const RESOLUTION = 2; // Render at increased resolution so particles don't appear pixellated on a large screen.

  class SoundParticleLayer extends CanvasNode {

    /**
     * @param {WavesScreenModel} model
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

      // @private
      this.modelViewTransform = ModelViewTransform2.createRectangleMapping(
        model.soundScene.getWaveAreaBounds(),
        waveAreaNodeBounds
      );

      const toImage = color => new ShadedSphereNode( 10, {
        mainColor: color,
        stroke: 'black'
      } ).rasterized( {
        resolution: RESOLUTION,
        useCanvas: true
      } ).children[ 0 ].image;

      // @private
      this.whiteSphereImage = toImage( 'rgb(210,210,210)' );

      // @private
      this.redSphereImage = toImage( 'red' );

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
     */
    paintCanvas( context ) {
      context.transform( 1 / RESOLUTION, 0, 0, 1 / RESOLUTION, 0, 0 );
      this.model.soundScene.soundParticles.forEach( soundParticle => {

        // Red particles are shown on a grid
        const isRed = ( soundParticle.i % 4 === 2 && soundParticle.j % 4 === 2 );
        const sphereImage = isRed ? this.redSphereImage : this.whiteSphereImage;

        context.drawImage(
          sphereImage,
          RESOLUTION * ( this.modelViewTransform.modelToViewX( soundParticle.x ) ) - sphereImage.width / 2,
          RESOLUTION * ( this.modelViewTransform.modelToViewY( soundParticle.y ) ) - sphereImage.height / 2
        );
      } );
    }
  }

  return waveInterference.register( 'SoundParticleLayer', SoundParticleLayer );
} );