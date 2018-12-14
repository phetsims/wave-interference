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
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  // constants
  const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
  const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
  const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
  const MARGIN = 10;                       // Width of the pulse side segments, in pixels
  const WIDTH = 50;                        // Size of wave, in pixels

  class InputTypeIconNode extends Node {

    /**
     * @param {WaveTemporalType} incidentWaveType
     * @param {Object} [options]
     */
    constructor( incidentWaveType, options ) {
      super();
      const minAngle = incidentWaveType === WaveTemporalType.PULSE ? Math.PI : 0;
      const minX = incidentWaveType === WaveTemporalType.PULSE ? MARGIN : 0;
      const maxX = incidentWaveType === WaveTemporalType.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

      const shape = new Shape();
      for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
        const angle = Util.linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
        const y = -Math.cos( angle ) * WAVE_HEIGHT;
        const x = Util.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
        if ( i === 0 ) {
          if ( incidentWaveType === WaveTemporalType.PULSE ) {
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
      if ( incidentWaveType === WaveTemporalType.PULSE ) {
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