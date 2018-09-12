// Copyright 2018, University of Colorado Boulder

/**
 * When selected, shows discrete and moving particles for the sound view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class SoundParticleLayer extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaNodeBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaNodeBounds, options ) {
      super();
      const modelViewTransform = ModelViewTransform2.createRectangleMapping( model.soundScene.getWaveAreaBounds(), waveAreaNodeBounds );

      // Create one sphere node for each particle, some are randomly red.  There is a fixed number of particles, so
      // we can add them all during startup.
      model.soundScene.soundParticles.forEach( soundParticle =>
        this.addChild( new ShadedSphereNode( 10, {
          x: modelViewTransform.modelToViewX( soundParticle.x ),
          y: modelViewTransform.modelToViewX( soundParticle.y ),
          mainColor: ( soundParticle.i % 5 === 0 && soundParticle.k % 5 === 0 ) ? 'red' : 'rgb(210,210,210)',
          stroke: 'black'
        } ) ) );
      this.mutate( options );

      const updateSoundParticleNodes = () => model.soundScene.soundParticles.forEach( ( soundParticle, i ) => {
        this.getChildAt( i ).mutate( {
          x: modelViewTransform.modelToViewX( soundParticle.x ),
          y: modelViewTransform.modelToViewX( soundParticle.y )
        } );
      } );

      // At the end of each model step, update all of the particles as a batch.
      const updateIfSoundScene = () => {
        if ( model.sceneProperty.value === model.soundScene ) {
          updateSoundParticleNodes();
        }
      };
      model.stepEmitter.addListener( updateIfSoundScene );
      model.sceneProperty.link( updateIfSoundScene );
    }
  }

  return waveInterference.register( 'SoundParticleLayer', SoundParticleLayer );
} );