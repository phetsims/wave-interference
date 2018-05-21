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

  // text
  var vertexShader = require( 'text!WAVE_INTERFERENCE/common/view/LatticeWebGLNode.vert' );
  var fragmentShader = require( 'text!WAVE_INTERFERENCE/common/view/LatticeWebGLNode.frag' );

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
    setBaseColor: function( baseColor ) {
      this.baseColor = baseColor || new Color( 'black' );
    }
  } );

  function Painter( gl, node ) {
    this.gl = gl;
    this.node = node;
    var lattice = node.lattice;

    this.shaderProgram = new ShaderProgram( gl, vertexShader, fragmentShader, {
      attributes: [ 'aPosition', 'aWaveValue' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uBaseColor' ]
    } );

    this.vertexBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );

    var cellWidth = 10.1;

    // TODO: this is a hack to get things to line up-ish
    var VERTEX_OFFSET_X = -200;
    var VERTEX_OFFSET_Y = -200;

    // The vertices are created and buffered once, the geometry never changes.  We use a triangle strip, see
    // http://www.corehtml5.com/trianglestripfundamentals.php
    var vertices = [];
    for ( var i = lattice.dampX; i < lattice.width - lattice.dampX; i++ ) {
      for ( var k = lattice.dampY; k < lattice.height - lattice.dampY; k++ ) {
        vertices.push( i * cellWidth + VERTEX_OFFSET_X, k * cellWidth + VERTEX_OFFSET_Y );
        vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, k * cellWidth + VERTEX_OFFSET_Y );
      }
      vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, ( k - 1 ) * cellWidth + VERTEX_OFFSET_Y );
      vertices.push( ( i + 1 ) * cellWidth + VERTEX_OFFSET_X, lattice.dampY * cellWidth + VERTEX_OFFSET_Y );
    }
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    this.waveValueBuffer = gl.createBuffer();

    // @private - allocate once and reuse
    this.valueArray = [];
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
      gl.uniform3f( shaderProgram.uniformLocations.uBaseColor, node.baseColor.red / 255, node.baseColor.green / 255, node.baseColor.blue / 255 );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

      // Add the color values
      gl.bindBuffer( gl.ARRAY_BUFFER, this.waveValueBuffer );
      var index = 0;
      for ( var i = lattice.dampX; i < node.lattice.width - lattice.dampX; i++ ) {
        for ( var k = lattice.dampY; k < node.lattice.height - lattice.dampY; k++ ) {
          var value = node.lattice.getCurrentValue( i, k );
          this.valueArray[ index++ ] = value;
          this.valueArray[ index++ ] = value;
        }
        this.valueArray[ index++ ] = value;
        this.valueArray[ index++ ] = value;
      }
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.valueArray ), gl.STATIC_DRAW );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aWaveValue, 1, gl.FLOAT, false, 0, 0 );

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