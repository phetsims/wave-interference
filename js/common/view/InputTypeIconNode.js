// Copyright 2018, University of Colorado Boulder

//REVIEW^ This is a visual representation of WaveTemporalType, so why is this class name totally different? why not WaveTermTypeNode?
/**
 * Shows the icons for the radio buttons that choose between pulse and continuous waves.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  // constants
  const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
  const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
  const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
  const MARGIN = 10;                       // Width of the pulse side segments, in pixels
  const WIDTH = 50;                        // Size of wave, in pixels

  class InputTypeIconNode extends Node {

    //REVIEW rename to waveTemporalType
    //REVIEW* done, please review
    /**
     * @param {WaveTemporalType} waveTemporalType
     * @param {Object} [options]
     */
    constructor( waveTemporalType, options ) {
      super();

      //REVIEW Implementation is unnecessarily complicated because you're trying to do both icons in one class. Separate into 2 classes?
      //REVIEW* That would lead to a significant amount of duplicated code.  What do you recommend?
      const minAngle = waveTemporalType === WaveTemporalType.PULSE ? Math.PI : 0;
      const minX = waveTemporalType === WaveTemporalType.PULSE ? MARGIN : 0;
      const maxX = waveTemporalType === WaveTemporalType.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

      const shape = new Shape();
      for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
        const angle = Util.linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
        const y = -Math.cos( angle ) * WAVE_HEIGHT;
        const x = Util.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
        if ( i === 0 ) {
          if ( waveTemporalType === WaveTemporalType.PULSE ) {
            shape.moveTo( x - MARGIN, y );
            shape.lineTo( x, y );
          }
          else {
            shape.moveTo( x, y );
          }
        }
        else {
          shape.lineTo( x, y );
        }
      }
      if ( waveTemporalType === WaveTemporalType.PULSE ) {
        shape.lineToRelative( MARGIN, 0 );
      }

      this.addChild( new Path( shape, {
        stroke: 'black',
        lineWidth: 2
      } ) );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'InputTypeIconNode', InputTypeIconNode );
} );