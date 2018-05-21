// Copyright 2017, University of Colorado Boulder

/**
 * Renders the lattice using rectangles in WebGL. Adapted from charges and fields
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );
  var WebGLNode = require( 'SCENERY/nodes/WebGLNode' );

  /**
   * @param {Lattice} lattice
   * @param {Object} [options]
   * @constructor
   */
  function LatticeWebGLNode( lattice, options ) {

    // @private
    this.lattice = lattice;

    // @private
    this.baseColor = new Color( 'blue' );

    // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light source
    this.vacuumColor = null;

    options = _.extend( {

      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: WaveInterferenceUtils.getCanvasBounds( lattice ),
      layerSplit: true // ensure we're on our own layer
    }, options );

    WebGLNode.call( this, Painter, options );

    // Invalidate paint when model indicates changes
    var invalidateSelfListener = this.invalidatePaint.bind( this );
    lattice.changedEmitter.addListener( invalidateSelfListener );
  }

  waveInterference.register( 'LatticeWebGLNode', LatticeWebGLNode );

  inherit( WebGLNode, LatticeWebGLNode, {
    setBaseColor: function() {}
  } );

  function Painter( gl, node ) {
    this.gl = gl;
    this.node = node;
    var lattice = node.lattice;

    // Simple example for custom shader
    var lineVertexShaderSource = [
      // Position
      'attribute vec2 aPosition;',
      'uniform mat3 uModelViewMatrix;',
      'uniform mat3 uProjectionMatrix;',

      'attribute float aColor;',      // New: added vec4 attribute
      'varying float color;',          // New: this will be passed to fragment shader

      'void main( void ) {',

      // homogeneous model-view transformation
      '  vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );',

      // homogeneous map to to normalized device coordinates
      '  vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );',

      // combine with the z coordinate specified
      '  gl_Position = vec4( ndc.xy, 0.1, 1.0 );',
      '  color=aColor;',
      '}'
    ].join( '\n' );

    // Simple demo for custom shader
    var lineFragmentShaderSource = [
      'precision mediump float;',
      'varying float color;',

      // Returns the color from the vertex shader
      'void main( void ) {',
      '  float c = 0.25 * (color +2.0) ;',
      '  gl_FragColor = vec4(0,0,c,1);',
      '}'
    ].join( '\n' );

    this.shaderProgram = new ShaderProgram( gl, lineVertexShaderSource, lineFragmentShaderSource, {
      attributes: [ 'aPosition', 'aColor' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix' ]
    } );

    this.vertexBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    var vertices = [];
    var cellWidth = 10.1;

    // @private - allocate once and reuse
    this.colorArray = [];

    // TODO: this is a hack to get things to line up-ish
    var VERTEX_OFFSET_X = -200;
    var VERTEX_OFFSET_Y = -200;

    // Triangle Strip, see http://www.corehtml5.com/trianglestripfundamentals.phpk
    for ( var i = lattice.dampX; i < lattice.width - lattice.dampX; i++ ) {
      for ( var k = lattice.dampY; k < lattice.height - lattice.dampY; k++ ) {
        vertices.push( i * cellWidth + VERTEX_OFFSET_X, k * cellWidth + VERTEX_OFFSET_Y );
        vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, k * cellWidth + VERTEX_OFFSET_Y );
        this.colorArray.push( 0 );
        this.colorArray.push( 0 );
      }
      vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, ( k - 1 ) * cellWidth + VERTEX_OFFSET_Y );
      vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, lattice.dampY * cellWidth + VERTEX_OFFSET_Y );
      this.colorArray.push( 0 );
      this.colorArray.push( 0 );
    }
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    this.colorBuffer = gl.createBuffer();
  }

  inherit( Object, Painter, {
    paint: function( modelViewMatrix, projectionMatrix ) {
      var gl = this.gl;
      var shaderProgram = this.shaderProgram;
      var node = this.node;
      var lattice = node.lattice;

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.entries );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.entries );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
      var index = 0;
      for ( var i = lattice.dampX; i < node.lattice.width - lattice.dampX; i++ ) {
        for ( var k = lattice.dampY; k < node.lattice.height - lattice.dampY; k++ ) {
          var value = node.lattice.getCurrentValue( i, k );
          this.colorArray[ index++ ] = value;
          this.colorArray[ index++ ] = value;
        }
        this.colorArray[ index++ ] = value;
        this.colorArray[ index++ ] = value;
      }
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.colorArray ), gl.STATIC_DRAW );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aColor, 1, gl.FLOAT, false, 0, 0 );

      // 3 vertices per triangle and 2 triangles per square
      var w = ( this.node.lattice.width - lattice.dampX * 2 );
      var h = ( this.node.lattice.height - lattice.dampX * 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, w * h * 2 );

      shaderProgram.unuse();

      return WebGLNode.PAINTED_SOMETHING;
    },

    dispose: function() {
      this.shaderProgram.dispose();
      this.gl.deleteBuffer( this.vertexBuffer );

      this.shaderProgram = null;
    }
  } );

  return LatticeWebGLNode;
} );