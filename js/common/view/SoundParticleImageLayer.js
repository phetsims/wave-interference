// Copyright 2019, University of Colorado Boulder

/**
 * When selected, shows discrete and moving particles for the sound view.
 * TODO: docs if this works
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SoundParticleImageLayer extends Node {

    /**
     * @param {WavesModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {

      options = _.extend( {

        layerSplit: true, // ensure we're on our own layer
        renderer: 'webgl',
        children: [ Rectangle.bounds( waveAreaNodeBounds, {} ) ] // TODO: eliminate
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
          for ( let i = 0; i < images.length; i++ ) {
            images[ i ].update();
          }
        }
      };
      model.stepEmitter.addListener( update );
      model.sceneProperty.link( update );

      const images = [];

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
    constructor( soundParticle, image, modelViewTransform ) {
      super( image, { scale: 0.5 } );
      this.soundParticle = soundParticle;
      this.image = image;
      this.modelViewTransform = modelViewTransform;
    }

    update() {
      const x = ( this.modelViewTransform.modelToViewX( this.soundParticle.x ) ) - this.width / 2;
      const y = ( this.modelViewTransform.modelToViewY( this.soundParticle.y ) ) - this.height / 2;
      this.setTranslation( x, y );
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

  return waveInterference.register( 'SoundParticleImageLayer', SoundParticleImageLayer );
} );