// Copyright 2018, University of Colorado Boulder

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
  const DisturbanceType = require( 'WAVE_INTERFERENCE/common/model/DisturbanceType' );

  // constants
  const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
  const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
  const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
  const MARGIN = 10;                       // Width of the pulse side segments, in pixels
  const WIDTH = 50;                        // Size of wave, in pixels

  class DisturbanceTypeIconNode extends Node {

    /**
     * @param {DisturbanceType} disturbanceType
     * @param {Object} [options]
     */
    constructor( disturbanceType, options ) {
      super();

      //REVIEW Implementation is unnecessarily complicated because you're trying to do both icons in one class. Separate into 2 classes?
      //REVIEW That would lead to a significant amount of duplicated code.  What do you recommend?
      //REVIEW I took a stab at separate classes and I'm convinced about the 'duplicated code'. So leave as is.
      const minAngle = disturbanceType === DisturbanceType.PULSE ? Math.PI : 0;
      const minX = disturbanceType === DisturbanceType.PULSE ? MARGIN : 0;
      const maxX = disturbanceType === DisturbanceType.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

      const shape = new Shape();
      for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
        const angle = Util.linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
        const y = -Math.cos( angle ) * WAVE_HEIGHT;
        const x = Util.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
        if ( i === 0 ) {
          if ( disturbanceType === DisturbanceType.PULSE ) {
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
      if ( disturbanceType === DisturbanceType.PULSE ) {
        shape.lineToRelative( MARGIN, 0 );
      }

      this.addChild( new Path( shape, {
        stroke: 'black',
        lineWidth: 2
      } ) );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'DisturbanceTypeIconNode', DisturbanceTypeIconNode );
} );