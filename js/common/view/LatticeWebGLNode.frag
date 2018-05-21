precision mediump float;
varying float waveValue;

// Returns the color from the vertex shader
void main( void ) {
	float c = 0.25 * (waveValue + 2.0);
	gl_FragColor = vec4( 0, 0, c, 1);
}