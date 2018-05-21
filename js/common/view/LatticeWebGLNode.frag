// Copyright 2017-2018, University of Colorado Boulder

/**
 * Fragment shader for the LatticeWebGLNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
precision mediump float;

// Inputs from the fragment shader
varying float waveValue;
varying vec3 baseColor;
varying float hasCellBeenVisited;

// constants
vec3 BLACK = vec3( 0.0, 0.0, 0.0 );

/**
 * Port of DOT/Util.linear
 */
float linear( float a1, float a2, float b1, float b2, float a3 ) {
  return ( b2 - b1 ) / ( a2 - a1 ) * ( a3 - a1 ) + b1;
}

/**
 * Port of DOT/Util.clamp
 */
float dotclamp( float value, float min, float max ) {
  if ( value < min ) {
    return min;
  }
  else if ( value > max ) {
    return max;
  }
  else {
    return value;
  }
}

/**
 * Port of Color.blend, but ignoring opacity.  This maintains consistency with the canvas renderer.
 */
vec3 colorBlend( vec3 color1, vec3 color2, float ratio ) {

  float gamma = 2.4;
  float linearRedA = pow( color1.r, gamma );
  float linearRedB = pow( color2.r, gamma );
  float linearGreenA = pow( color1.g, gamma );
  float linearGreenB = pow( color2.g, gamma );
  float linearBlueA = pow( color1.b, gamma );
  float linearBlueB = pow( color2.b, gamma );

  float r = pow( linearRedA + ( linearRedB - linearRedA ) * ratio, 1.0 / gamma );
  float g = pow( linearGreenA + ( linearGreenB - linearGreenA ) * ratio, 1.0 / gamma );
  float b = pow( linearBlueA + ( linearBlueB - linearBlueA ) * ratio, 1.0 / gamma );

  return vec3( r, g, b );
}

/**
 * Assigns the color to the given fragment.  Must be kept in sync with LatticeCanvasNode.paintCanvas.
 */
void main( void ) {

   if (hasCellBeenVisited==0.0){
     gl_FragColor = vec4( BLACK, 1 );
   } else {
       float intensity;
       float CUTOFF = 0.3;
       if ( waveValue > 0.0 ) {
           intensity = linear( 0.0, 2.0, CUTOFF, 1.0, waveValue );
           intensity = dotclamp( intensity, CUTOFF, 1.0 );
       }
       else {
           float MIN_SHADE = 0.03; // Stop before 0 because 0 is too jarring
           intensity = linear( -1.5, 0.0, MIN_SHADE, CUTOFF, waveValue );
           intensity = dotclamp( intensity, MIN_SHADE, CUTOFF );
       }

      vec4 color = vec4( colorBlend( baseColor, BLACK, 1.0 - intensity ), 1.0 );
      gl_FragColor = color;
   }
}