// Copyright 2017-2018, University of Colorado Boulder

/**
 * Vertex shader for the LatticeWebGLNode, adapted from Charges and Fields
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// The position of the vertex
attribute vec2 aPosition;

// The value of the wave at that point in the lattice
attribute float aWaveValue;

// Whether the cell has been visited
attribute float aHasCellBeenVisited;

// Inputs from the JS side
uniform mat3 uModelViewMatrix;
uniform mat3 uProjectionMatrix;
uniform vec3 uBaseColor;

// Passed through to the fragment shader
varying float waveValue;
varying vec3 baseColor;
varying float hasCellBeenVisited;

void main( void ) {

    // homogeneous model-view transformation
    vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );

    // homogeneous map to to normalized device coordinates
    vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );

    // Pass values through to the fragment shader
    waveValue = aWaveValue;
    baseColor = uBaseColor;
    hasCellBeenVisited = aHasCellBeenVisited;
    gl_Position = vec4( ndc.xy, 0.1, 1.0 );
}