// Position
attribute vec2 aPosition;
uniform mat3 uModelViewMatrix;
uniform mat3 uProjectionMatrix;

attribute float aColor;       // New: added vec4 attribute
varying float color;          // New: this will be passed to fragment shader

void main( void ) {

    // homogeneous model-view transformation
    vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );

    // homogeneous map to to normalized device coordinates
    vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );

    // combine with the z coordinate specified
    gl_Position = vec4( ndc.xy, 0.1, 1.0 );
    color=aColor;
}