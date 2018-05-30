// Copyright 2017, University of Colorado Boulder

/**
 * Renders the lattice using rectangles in WebGL. Adapted from charges and fields.
 * TODO: @jonathanolson pointed out that we should use 2 triangles + texture map to render everything, if we can't get
 * TODO: fast enough performance with canvas.
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
      attributes: [ 'aPosition', 'aWaveValue', 'aHasCellBeenVisited' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uBaseColor' ]
    } );

    this.vertexBuffer = gl.createBuffer();

    // The vertices are created and buffered once, the geometry never changes
    var width = lattice.width - lattice.dampX * 2;
    var height = lattice.height - lattice.dampY * 2;
    var vertices = [];
    for ( var i = 0; i < width; i++ ) {
      for ( var k = 0; k < height; k++ ) {
        vertices.push( i, k );
        vertices.push( i + 1, k );
        vertices.push( i, k + 1 );

        vertices.push( i + 1, k );
        vertices.push( i + 1, k + 1 );
        vertices.push( i, k + 1 );
      }
    }
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    this.waveValueBuffer = gl.createBuffer();
    this.hasCellBeenVisitedBuffer = gl.createBuffer();

    // @private - allocate and reuse to populate the buffer
    this.valueArray = [];

    // @private - allocate and reuse to populate the buffer
    this.hasCellBeenVisitedArray = [];
  }

  inherit( Object, Painter, {

    /**
     * Renders the lattice using WebGL
     * @param {Matrix3} modelViewMatrix
     * @param {Matrix3} projectionMatrix
     * @returns {number} - flag that indicates paint state
     */
    paint: function( modelViewMatrix, projectionMatrix ) {
      var gl = this.gl;
      var shaderProgram = this.shaderProgram;
      var node = this.node;
      var lattice = node.lattice;

      var width = lattice.width - lattice.dampX * 2;
      var height = lattice.height - lattice.dampY * 2;

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

          // TODO: optimize?  Inline getIndex or move this to the GPU?
          // Getting the value at each vertex makes it possible to linearly interpolate in the graphics, which
          // looks much better than the discrete form we see in canvas
          var value = node.lattice.getCurrentValue( i, k );
          var valueX = node.lattice.getCurrentValue( i + 1, k );
          var valueY = node.lattice.getCurrentValue( i, k + 1 );
          var valueXY = node.lattice.getCurrentValue( i + 1, k + 1 );
          this.valueArray[ index++ ] = value;
          this.valueArray[ index++ ] = valueX;
          this.valueArray[ index++ ] = valueY;

          this.valueArray[ index++ ] = valueX;
          this.valueArray[ index++ ] = valueXY;
          this.valueArray[ index++ ] = valueY;
        }
      }
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.valueArray ), gl.STATIC_DRAW );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aWaveValue, 1, gl.FLOAT, false, 0, 0 );

      // Add whether the cells have been visited
      gl.bindBuffer( gl.ARRAY_BUFFER, this.hasCellBeenVisitedBuffer );
      index = 0;
      for ( i = lattice.dampX; i < node.lattice.width - lattice.dampX; i++ ) {
        for ( k = lattice.dampY; k < node.lattice.height - lattice.dampY; k++ ) {
          // If there is no vacuum, then act as if the cell has been visited, so it will get the normal coloring.
          var hasCellBeenVisited = 1.0;
          var hasCellBeenVisitedX = 1.0;
          var hasCellBeenVisitedY = 1.0;
          var hasCellBeenVisitedXY = 1.0;

          // When there is a vacuum, make sure the cell has been visited before it can be colorized.
          // TODO: there is a visual asymmetry
          if ( node.vacuumColor ) {
            hasCellBeenVisited = node.lattice.hasCellBeenVisited( i, k ) ? 1.0 : 0.0;
            hasCellBeenVisitedX = node.lattice.hasCellBeenVisited( i + 1, k ) ? 1.0 : 0.0;
            hasCellBeenVisitedY = node.lattice.hasCellBeenVisited( i, k + 1 ) ? 1.0 : 0.0;
            hasCellBeenVisitedXY = node.lattice.hasCellBeenVisited( i + 1, k + 1 ) ? 1.0 : 0.0;
          }

          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisited;
          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisitedX;
          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisitedY;

          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisitedX;
          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisitedXY;
          this.hasCellBeenVisitedArray[ index++ ] = hasCellBeenVisitedY;
        }
      }
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.hasCellBeenVisitedArray ), gl.STATIC_DRAW );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aHasCellBeenVisited, 1, gl.FLOAT, false, 0, 0 );

      // 3 vertices per triangle and 2 triangles per square
      gl.drawArrays( gl.TRIANGLES, 0, width * height * 6 );

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