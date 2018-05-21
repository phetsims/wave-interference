precision mediump float;
varying float color;

// Returns the color from the vertex shader
void main( void ) {
	float c = 0.25 * (color + 2.0);
	gl_FragColor = vec4( 0, 0, c, 1);
}