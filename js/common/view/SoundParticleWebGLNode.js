// Copyright 2015-2017, University of Colorado Boulder

/**
 * A WebGL Scenery node that is used to render the sodium and potassium particles, a.k.a. ions, that need to be
 * portrayed in the Neuron simulation.  This node exists as an optimization, since representing every particle as an
 * individual Scenery node proved to be far too computationally intensive.
 *
 * In this node, particles are rendered using a texture that is created on a canvas.  The texture exists as a separate
 * class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (for Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const NeuronParticlesTexture = require( 'WAVE_INTERFERENCE/common/view/NeuronParticlesTexture' );
  const ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  const Vector2 = require( 'DOT/Vector2' );
  const WebGLNode = require( 'SCENERY/nodes/WebGLNode' );

  // constants
  const MAX_PARTICLES = 2000; // several trials were run and peak number of particles was 1841, so this value should be safe
  const VERTICES_PER_PARTICLE = 4; // basically one per corner of the rectangle that encloses the particle
  const POSITION_VALUES_PER_VERTEX = 2; // x and y, z is considered to be always 1
  const TEXTURE_VALUES_PER_VERTEX = 2; // x and y coordinates within the 2D texture
  const OPACITY_VALUES_PER_VERTEX = 1; // a single value from 0 to 1
  const scratchFloatArray = new Float32Array( 9 );

  /**
   * @param {WavesModel} model
   * @param {Bounds2} bounds
   * @param {Object} [options]
   */
  function SoundParticleWebGLNode( model, modelViewTransform, zoomMatrixProperty, bounds ) {
    const self = this;
    WebGLNode.call( this, ParticlesPainter, {
      canvasBounds: bounds
    } );

    // Keep references to the things that needed in order to render the particles.
    this.model = model; // @private
    this.modelViewTransform = modelViewTransform; // @private
    this.viewTransformationMatrix = modelViewTransform.getMatrix(); // @private
    this.zoomMatrixProperty = zoomMatrixProperty; // @private
    this.particleBounds = bounds; // @private

    // Create the texture for the particles.
    this.particlesTexture = new NeuronParticlesTexture( modelViewTransform ); // @private

    // @private - pre-allocated arrays and values that are reused for better performance
    this.vertexData = new Float32Array( MAX_PARTICLES * VERTICES_PER_PARTICLE *
                                        ( POSITION_VALUES_PER_VERTEX + TEXTURE_VALUES_PER_VERTEX + OPACITY_VALUES_PER_VERTEX ) );
    this.elementData = new Uint16Array( MAX_PARTICLES * ( VERTICES_PER_PARTICLE + 2 ) );
    this.particleData = new Array( MAX_PARTICLES );

    // pre-calculate the texture coordinates for the two different particle types
    this.sodiumTextureCoords = this.particlesTexture.getTexCoords( 'SODIUM_ION' );
    this.potassiumTextureCoords = this.particlesTexture.getTexCoords( 'POTASSIUM_ION' );

    for ( let i = 0; i < MAX_PARTICLES; i++ ) {

      // For better performance, the array of particle data objects is initialized here and the values updated rather
      // than reallocated during each update.
      this.particleData[ i ] = {
        pos: new Vector2(),
        radius: 1,
        type: null,
        opacity: 1
      };

      // Also for better performance, the element data is initialized at the start for the max number of particles.
      const indexBase = i * 6;
      const valueBase = i * 4;
      this.elementData[ indexBase ] = valueBase;
      this.elementData[ indexBase + 1 ] = valueBase + 1;
      this.elementData[ indexBase + 2 ] = valueBase + 2;
      this.elementData[ indexBase + 3 ] = valueBase + 3;
      if ( i + 1 < MAX_PARTICLES ) {
        // Add the 'degenerate triangle' that will force a discontinuity in the triangle strip.
        this.elementData[ indexBase + 4 ] = valueBase + 3;
        this.elementData[ indexBase + 5 ] = valueBase + 4;
      }
    }

    this.numActiveParticles = 0; // @private

    // initial update
    this.updateParticleData();

    // monitor a property that indicates when a particle state has changed and initiate a redraw
    model.stepEmitter.addListener( self.invalidatePaint.bind( self ) );
    model.sceneProperty.link( self.invalidatePaint.bind( self ) );
  }

  waveInterference.register( 'SoundParticleWebGLNode', SoundParticleWebGLNode );

  inherit( WebGLNode, SoundParticleWebGLNode, {

    /**
     * Check if the provided particle is in the current rendering bounds and, if so, create a particle data object and
     * add it to the list that will be converted into vertex data in a subsequent step.
     * @param {Particle} particle
     * @private
     */
    addParticleData: function( particle ) {
      const xPos = this.modelViewTransform.modelToViewX( particle.x );
      const yPos = this.modelViewTransform.modelToViewY( particle.y );
      const radius = this.modelViewTransform.modelToViewDeltaX( 4 );

      // Figure out the location and radius of the zoomed particle.
      const zoomMatrix = this.zoomMatrixProperty.value;
      const zoomedXPos = zoomMatrix.m00() * xPos + zoomMatrix.m02();
      const zoomedYPos = zoomMatrix.m11() * yPos + zoomMatrix.m12();
      const zoomedRadius = zoomMatrix.m00() * radius;

      // Only add the particle if its zoomed location is within the bounds being shown.
      const particleDataEntry = this.particleData[ this.numActiveParticles ];
      particleDataEntry.pos.setXY( zoomedXPos, zoomedYPos );
      particleDataEntry.radius = zoomedRadius;
      particleDataEntry.type = 'SODIUM_ION'; // TODO:
      particleDataEntry.opacity = 1;
      assert && assert( this.numActiveParticles < MAX_PARTICLES - 1 );
      this.numActiveParticles = Math.min( this.numActiveParticles + 1, MAX_PARTICLES );
    },

    /**
     * Update the representation shown in the canvas based on the model state.  This is intended to be called any time
     * one or more particles move in a given time step, which means once per frame or less.
     * @private
     */
    updateParticleData: function() {
      this.numActiveParticles = 0;

      // For better performance, we loop over the arrays contained within the observable arrays rather than using the
      // forEach function.  This is much more efficient.  Note that this is only safe if no mods are made to the
      // contents of the observable array.

      let i;
      const particleArray = this.model.soundScene.soundParticles;

      for ( i = 0; i < particleArray.length; i++ ) {
        this.addParticleData( particleArray[ i ] );
      }
    }
  } );

  /**
   * Constructor for the object that will do the actual painting for this node.  This constructor, rather than an
   * instance, is passed to the parent WebGLNode type.
   * @constructor
   * @param {WebGLRenderingContext} gl
   * @param {WaveWebGLNode} node
   */
  function ParticlesPainter( gl, node ) {
    this.gl = gl;
    this.node = node;

    // vertex shader
    const vertexShaderSource = [
      'attribute vec2 aPosition;',
      'attribute vec2 aTextureCoordinate;',
      'attribute float aOpacity;',
      'varying vec2 vTextureCoordinate;',
      'varying float vOpacity;',
      'uniform mat3 uModelViewMatrix;',
      'uniform mat3 uProjectionMatrix;',

      'void main( void ) {',
      // homogeneous model-view transformation
      '  vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );',
      // homogeneous map to to normalized device coordinates
      '  vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );',
      // texture coordinate
      '  vTextureCoordinate = aTextureCoordinate;',
      // opacity
      '  vOpacity = aOpacity;',
      // assume a z value of 1 for the position
      '  gl_Position = vec4( ndc.xy, 1.0, 1.0 );',
      '}'
    ].join( '\n' );

    // fragment shader
    const fragmentShaderSource = [
      'precision mediump float;',
      'varying vec2 vTextureCoordinate;',
      'varying float vOpacity;',
      'uniform sampler2D uSampler;',
      'void main( void ) {',
      '  gl_FragColor = texture2D( uSampler, vTextureCoordinate );',
      '  gl_FragColor.a *= vOpacity;',

      // Use premultipled alpha, see https://github.com/phetsims/energy-skate-park/issues/39
      '  gl_FragColor.rgb *= gl_FragColor.a;',
      '}'
    ].join( '\n' );

    this.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
      attributes: [ 'aPosition', 'aTextureCoordinate', 'aOpacity' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix' ]
    } );

    this.texture = gl.createTexture();
    this.vertexBuffer = gl.createBuffer();
    this.elementBuffer = gl.createBuffer();

    // bind the texture that contains the particle images
    gl.bindTexture( gl.TEXTURE_2D, this.texture );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    // Texture filtering, see http://learningwebgl.com/blog/?p=571
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    // ship the texture data to the GPU
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.node.particlesTexture.canvas );

    // generate a mipmap for better handling of zoom in/out
    gl.generateMipmap( gl.TEXTURE_2D );
  }

  inherit( Object, ParticlesPainter, {
    paint: function( modelViewMatrix, projectionMatrix ) {
      const gl = this.gl;
      const shaderProgram = this.shaderProgram;
      let i; // loop index

      this.node.updateParticleData();

      // Convert particle data to vertices that represent a rectangle plus texture coordinates.
      let vertexDataIndex = 0;
      for ( i = 0; i < this.node.numActiveParticles; i++ ) {

        // convenience var
        const particleDatum = this.node.particleData[ i ];

        // Tweak Alert!  The radii of the particles are adjusted here in order to look correct.
        let adjustedParticleRadius;
        let textureCoordinates;
        if ( particleDatum.type === 'SODIUM_ION' ) {
          adjustedParticleRadius = particleDatum.radius * 1.9;
          textureCoordinates = this.node.sodiumTextureCoords;
        }
        else if ( particleDatum.type === 'POTASSIUM_ION' ) {
          adjustedParticleRadius = particleDatum.radius * 2.1;
          textureCoordinates = this.node.potassiumTextureCoords;
        }

        //-------------------------------------------------------------------------------------------------------------
        // Add the vertex data.  Though WebGL uses 3 component vectors, this only assigns x and y values because z is
        // assumed to be 1.  This is not done in a loop in order to get optimal performance.
        //-------------------------------------------------------------------------------------------------------------

        // upper left vertex position
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.x - adjustedParticleRadius;
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.y - adjustedParticleRadius;

        // texture coordinate, which is a 2-component vector
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.minX; // x texture coordinate
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.minY; // y texture coordinate

        // opacity, which is a single value
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.opacity;

        // lower left vertex position
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.x - adjustedParticleRadius;
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.y + adjustedParticleRadius;

        // texture coordinate, which is a 2-component vector
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.minX; // x texture coordinate
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.maxY; // y texture coordinate

        // opacity, which is a single value
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.opacity;

        // upper right vertex position
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.x + adjustedParticleRadius;
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.y - adjustedParticleRadius;

        // texture coordinate, which is a 2-component vector
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.maxX; // x texture coordinate
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.minY; // y texture coordinate

        // opacity, which is a single value
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.opacity;

        // lower right vertex position
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.x + adjustedParticleRadius;
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.pos.y + adjustedParticleRadius;

        // texture coordinate, which is a 2-component vector
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.maxX; // x texture coordinate
        this.node.vertexData[ vertexDataIndex++ ] = textureCoordinates.maxY; // y texture coordinate

        // opacity, which is a single value
        this.node.vertexData[ vertexDataIndex++ ] = particleDatum.opacity;
      }

      // Load the vertex data into the GPU.
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, this.node.vertexData, gl.DYNAMIC_DRAW );

      // Set up the attributes that will be passed into the vertex shader.
      const elementSize = Float32Array.BYTES_PER_ELEMENT;
      const elementsPerVertex = POSITION_VALUES_PER_VERTEX + TEXTURE_VALUES_PER_VERTEX + OPACITY_VALUES_PER_VERTEX;
      const stride = elementSize * elementsPerVertex;
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, stride, 0 );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aTextureCoordinate, 2, gl.FLOAT, false, stride,
        elementSize * TEXTURE_VALUES_PER_VERTEX );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aOpacity, 1, gl.FLOAT, false, stride,
        elementSize * ( POSITION_VALUES_PER_VERTEX + TEXTURE_VALUES_PER_VERTEX ) );

      // Load the element data into the GPU.
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer );
      gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.node.elementData, gl.STATIC_DRAW );

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );

      // activate and bind the texture
      gl.activeTexture( gl.TEXTURE0 );
      gl.bindTexture( gl.TEXTURE_2D, this.texture );
      gl.uniform1i( shaderProgram.uniformLocations.uSampler, 0 );

      // add the element data
      gl.drawElements( gl.TRIANGLE_STRIP, this.node.numActiveParticles * 6 - 2, gl.UNSIGNED_SHORT, 0 );

      shaderProgram.unuse();

      return WebGLNode.PAINTED_SOMETHING;
    },

    dispose: function() {
      this.shaderProgram.dispose();
      this.gl.deleteBuffer( this.vertexBuffer );
      this.gl.deleteTexture( this.texture );
      this.gl.deleteBuffer( this.elementBuffer );
      this.shaderProgram = null;
    }
  } );

  return SoundParticleWebGLNode;
} );