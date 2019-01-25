// Copyright 2018, University of Colorado Boulder

/**
 * When selected, shows discrete and moving particles for the sound view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  const Shape = require( 'KITE/Shape' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );
  const WebGLNode = require( 'SCENERY/nodes/WebGLNode' );

  // constants
  // Render at increased resolution so particles don't appear pixellated on a large screen.  See Node.rasterized's
  // resolution option for details about this value.
  const RESOLUTION = 2;

  const scratchFloatArray = new Float32Array( 9 );

  class Painter {
    constructor( gl, node ) {

      this.gl = gl;
      this.node = node;

      // Simple example for custom shader
      const vertexShaderSource =
        // Position
        `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat3 uModelViewMatrix;
        uniform mat3 uProjectionMatrix;

        void main( void ) {
          vColor = aColor;
          
          // homogeneous model-view transformation
          vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );
          
          // homogeneous map to to normalized device coordinates
          vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );
          
          // combine with the z coordinate specified
          gl_Position = vec4( ndc.xy, aPosition.z, 1.0 );
        }
        `;

      // Simple demo for custom shader
      const fragmentShaderSource = [
        'precision mediump float;',
        'varying vec3 vColor;',

        // Returns the color from the vertex shader
        'void main( void ) {',
        '  gl_FragColor = vec4( vColor, 1.0 );',
        '}'
      ].join( '\n' );

      this.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
        attributes: [ 'aPosition', 'aColor' ],
        uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix' ]
      } );

      this.vertexBuffer = gl.createBuffer();

      const points = node.shape.subpaths[ 0 ].points;
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [
        points[ 0 ].x, points[ 0 ].y, 0.2,
        points[ 1 ].x, points[ 1 ].y, 0.2,
        points[ 2 ].x, points[ 2 ].y, 0.2
      ] ), gl.STATIC_DRAW );

      this.colorBuffer = gl.createBuffer();

      gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ] ), gl.STATIC_DRAW );
    }

    paint( modelViewMatrix, projectionMatrix ) {
      const gl = this.gl;

      this.shaderProgram.use();

      gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
      gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aPosition, 3, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
      gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aColor, 3, gl.FLOAT, false, 0, 0 );

      gl.drawArrays( gl.TRIANGLES, 0, 3 );

      this.shaderProgram.unuse();

      return WebGLNode.PAINTED_SOMETHING;
    }

    dispose() {
      this.shaderProgram.dispose();
      this.gl.deleteBuffer( this.vertexBuffer );

      this.shaderProgram = null;
    }
  }


  class SoundParticleWebGLNode extends WebGLNode {

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

      super( Painter, options );

      this.shape = Shape.regularPolygon( 3, 100 * Math.sqrt( 2 ) );

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

  return waveInterference.register( 'SoundParticleWebGLNode', SoundParticleWebGLNode );
} );