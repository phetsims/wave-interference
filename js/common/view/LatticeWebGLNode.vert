// Position
attribute vec2 aPosition;
uniform mat3 uModelViewMatrix;
uniform mat3 uProjectionMatrix;
uniform vec3 uBaseColor;

// The value of the wave at that point in the lattice
attribute float aWaveValue;

// Passed through to the fragment shader
varying float waveValue;

varying vec3 baseColor;

void main( void ) {

    // homogeneous model-view transformation
    vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );

    // homogeneous map to to normalized device coordinates
    vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );

    // combine with the z coordinate specified
    gl_Position = vec4( ndc.xy, 0.1, 1.0 );
    waveValue=aWaveValue;
    baseColor = uBaseColor;
}