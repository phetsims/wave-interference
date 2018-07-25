// Copyright 2017, University of Colorado Boulder

/**
 * Renders the lattice using rectangles in WebGL. Adapted from charges and fields.
 * TODO(webgl): @jonathanolson pointed out that we should use 2 triangles + texture map to render everything, if we can't get fast enough performance with canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );
  const WebGLNode = require( 'SCENERY/nodes/WebGLNode' );

  // text
  const vertexShader = require( 'text!WAVE_INTERFERENCE/common/view/LatticeWebGLNode.vert' );
  const fragmentShader = require( 'text!WAVE_INTERFERENCE/common/view/LatticeWebGLNode.frag' );

  class LatticeWebGLNode {

    /**
     * @param {Lattice} lattice
     * @param {Object} [options]
     */
    constructor( lattice, options ) {

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
      const invalidateSelfListener = this.invalidatePaint.bind( this );
      lattice.changedEmitter.addListener( invalidateSelfListener );
    }

    setBaseColor( baseColor ) {
      this.baseColor = baseColor || new Color( 'black' );
    }
  }

  class Painter {
    constructor( gl, node ) {
      this.gl = gl;
      this.node = node;
      const lattice = node.lattice;

      this.shaderProgram = new ShaderProgram( gl, vertexShader, fragmentShader, {
        attributes: [ 'aPosition', 'aWaveValue', 'aHasCellBeenVisited' ],
        uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uBaseColor' ]
      } );

      this.vertexBuffer = gl.createBuffer();

      // The vertices are created and buffered once, the geometry never changes
      const width = lattice.width - lattice.dampX * 2;
      const height = lattice.height - lattice.dampY * 2;
      const vertices = [];
      for ( let i = 0; i < width; i++ ) {
        for ( let k = 0; k < height; k++ ) {
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

    /**
     * Renders the lattice using WebGL
     * @param {Matrix3} modelViewMatrix
     * @param {Matrix3} projectionMatrix
     * @returns {number} - flag that indicates paint state
     */
    paint( modelViewMatrix, projectionMatrix ) {
      const gl = this.gl;
      const shaderProgram = this.shaderProgram;
      const node = this.node;
      const lattice = node.lattice;

      const width = lattice.width - lattice.dampX * 2;
      const height = lattice.height - lattice.dampY * 2;

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.entries );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.entries );
      gl.uniform3f( shaderProgram.uniformLocations.uBaseColor, node.baseColor.red / 255, node.baseColor.green / 255, node.baseColor.blue / 255 );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

      // Add the color values
      gl.bindBuffer( gl.ARRAY_BUFFER, this.waveValueBuffer );
      let index = 0;
      for ( let i = lattice.dampX; i < node.lattice.width - lattice.dampX; i++ ) {
        for ( let k = lattice.dampY; k < node.lattice.height - lattice.dampY; k++ ) {

          // TODO(webgl): optimize?  Inline getIndex or move this to the GPU?
          // Getting the value at each vertex makes it possible to linearly interpolate in the graphics, which
          // looks much better than the discrete form we see in canvas
          const value = node.lattice.getCurrentValue( i, k );
          const valueX = node.lattice.getCurrentValue( i + 1, k );
          const valueY = node.lattice.getCurrentValue( i, k + 1 );
          const valueXY = node.lattice.getCurrentValue( i + 1, k + 1 );
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
      for ( let i = lattice.dampX; i < node.lattice.width - lattice.dampX; i++ ) {
        for ( let k = lattice.dampY; k < node.lattice.height - lattice.dampY; k++ ) {
          // If there is no vacuum, then act as if the cell has been visited, so it will get the normal coloring.
          let hasCellBeenVisited = 1.0;
          let hasCellBeenVisitedX = 1.0;
          let hasCellBeenVisitedY = 1.0;
          let hasCellBeenVisitedXY = 1.0;

          // When there is a vacuum, make sure the cell has been visited before it can be colorized.
          // TODO(webgl): there is a visual asymmetry
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
    }

    dispose() {
      this.shaderProgram.dispose();
      this.gl.deleteBuffer( this.vertexBuffer );

      this.shaderProgram = null;
    }
  }

  return waveInterference.register( 'LatticeWebGLNode', LatticeWebGLNode );
} );