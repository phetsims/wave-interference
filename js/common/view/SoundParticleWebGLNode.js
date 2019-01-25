// Copyright 2018, University of Colorado Boulder

/**
 * When selected, shows discrete and moving particles for the sound view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Matrix3 = require( 'DOT/Matrix3' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  const Shape = require( 'KITE/Shape' );
  const SpriteSheet = require( 'SCENERY/util/SpriteSheet' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );
  const WebGLNode = require( 'SCENERY/nodes/WebGLNode' );

  // constants
  // Render at increased resolution so particles don't appear pixellated on a large screen.  See Node.rasterized's
  // resolution option for details about this value.
  const RESOLUTION = 2;

  class Painter {
    constructor( gl, node ) {

      // @private {Float32Array} - Column-major 3x3 array specifying our projection matrix for 2D points
      // (homogenized to (x,y,1))

      this.spriteSheet = new SpriteSheet( true );
      this.spriteSheet.initializeContext( gl );
      this.spriteSheet.addImage( node.redSphereImage, node.redSphereImage.width, node.redSphereImage.height );
      this.spriteSheet.addImage( node.whiteSphereImage, node.whiteSphereImage.width, node.whiteSphereImage.height );

      // Projection {Matrix3} that maps from Scenery's global coordinate frame to normalized device coordinates,
      // where x,y are both in the range [-1,1] from one side of the Canvas to the other.
      this.projectionMatrix = new Matrix3();

      // @private {Float32Array} - Column-major 3x3 array specifying our projection matrix for 2D points
      // (homogenized to (x,y,1))
      this.projectionMatrixArray = new Float32Array( 9 );

      // @private {number} - Initial length of the vertex buffer. May increase as needed.
      this.lastArrayLength = 128;

      // @private {Float32Array}
      this.vertexArray = new Float32Array( this.lastArrayLength );

      this.gl = gl;
      this.node = node;

      assert && assert( gl, 'Should be an actual context' );

      // @private {WebGLRenderingContext}
      this.gl = gl;

      // @private {ShaderProgram}
      this.shaderProgram = new ShaderProgram( gl, [
        // vertex shader
        'attribute vec2 aVertex;',
        'attribute vec2 aTextureCoord;',
        'attribute float aAlpha;',
        'varying vec2 vTextureCoord;',
        'varying float vAlpha;',
        'uniform mat3 uProjectionMatrix;',

        'void main() {',
        '  vTextureCoord = aTextureCoord;',
        '  vAlpha = aAlpha;',
        '  vec3 ndc = uProjectionMatrix * vec3( aVertex, 1.0 );', // homogeneous map to to normalized device coordinates
        '  gl_Position = vec4( ndc.xy, 0.0, 1.0 );',
        '}'
      ].join( '\n' ), [
        // fragment shader
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying float vAlpha;',
        'uniform sampler2D uTexture;',

        'void main() {',
        '  vec4 color = texture2D( uTexture, vTextureCoord, -0.7 );', // mipmap LOD bias of -0.7 (for now)
        '  color.a *= vAlpha;',
        '  gl_FragColor = color;', // don't premultiply alpha (we are loading the textures as premultiplied already)
        '}'
      ].join( '\n' ), {
        // attributes: [ 'aVertex', 'aTextureCoord' ],
        attributes: [ 'aVertex', 'aTextureCoord', 'aAlpha' ],
        uniforms: [ 'uTexture', 'uProjectionMatrix' ]
      } );

      // @private {WebGLBuffer}
      this.vertexBuffer = gl.createBuffer();

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, this.vertexArray, gl.DYNAMIC_DRAW ); // fully buffer at the start

      // finalX = 2 * x / display.width - 1
      // finalY = 1 - 2 * y / display.height
      // result = matrix * ( x, y, 1 )
      this.projectionMatrix.rowMajor(
        2 / node.waveAreaNodeBounds.width, 0, -1,
        0, -2 / node.waveAreaNodeBounds.height, 1,
        0, 0, 1 );
      this.projectionMatrix.copyToArray( this.projectionMatrixArray );

      gl.viewport( 0.0, 0.0, node.waveAreaNodeBounds.width, node.waveAreaNodeBounds.height );
    }

    paint( modelViewMatrix, projectionMatrix ) {

      const gl = this.gl;

      this.shaderProgram.use();

      this.vertexArrayIndex = 0;
      this.drawCount = 0;

      // (uniform) projection transform into normalized device coordinates
      gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, this.projectionMatrixArray );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      // if we increased in length, we need to do a full bufferData to resize it on the GPU side
      if ( this.vertexArray.length > this.lastArrayLength ) {
        gl.bufferData( gl.ARRAY_BUFFER, this.vertexArray, gl.DYNAMIC_DRAW ); // fully buffer at the start
      }
      // otherwise do a more efficient update that only sends part of the array over
      else {
        gl.bufferSubData( gl.ARRAY_BUFFER, 0, this.vertexArray.subarray( 0, this.vertexArrayIndex ) );
      }

      const numComponents = 5;
      const sizeOfFloat = Float32Array.BYTES_PER_ELEMENT;
      const stride = numComponents * sizeOfFloat;
      gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aVertex, 2, gl.FLOAT, false, stride, 0 * sizeOfFloat );
      gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * sizeOfFloat );
      gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aAlpha, 1, gl.FLOAT, false, stride, 4 * sizeOfFloat );

      gl.activeTexture( gl.TEXTURE0 );
      gl.bindTexture( gl.TEXTURE_2D, this.spriteSheet.texture );
      gl.uniform1i( this.shaderProgram.uniformLocations.uTexture, 0 );

      gl.drawArrays( gl.TRIANGLES, 0, this.vertexArrayIndex / numComponents );

      gl.bindTexture( gl.TEXTURE_2D, null );

      this.drawCount++;

      this.vertexArrayIndex = 0;

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

      this.waveAreaNodeBounds = waveAreaNodeBounds;

      this.shape = new Shape();
      this.shape.moveTo( waveAreaNodeBounds.left, waveAreaNodeBounds.top );
      this.shape.lineTo( waveAreaNodeBounds.right, waveAreaNodeBounds.top );
      this.shape.lineTo( waveAreaNodeBounds.right, waveAreaNodeBounds.bottom );
      this.shape.close();

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