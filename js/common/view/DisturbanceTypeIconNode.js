// Copyright 2018-2019, University of Colorado Boulder

/**
 * Shows the icons for the radio buttons that choose between pulse and continuous waves.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const LineStyles = require( 'KITE/util/LineStyles' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
  const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
  const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
  const MARGIN = 10;                       // Width of the pulse side segments, in pixels
  const WIDTH = 50;                        // Size of wave, in pixels

  class DisturbanceTypeIconNode extends Node {

    /**
     * @param {Scene.DisturbanceType} disturbanceType
     * @param {Object} [options]
     */
    constructor( disturbanceType, options ) {

      options = _.extend( {
        stroked: false
      }, options );
      super();

      const minAngle = disturbanceType === Scene.DisturbanceType.PULSE ? Math.PI : 0;
      const minX = disturbanceType === Scene.DisturbanceType.PULSE ? MARGIN : 0;
      const maxX = disturbanceType === Scene.DisturbanceType.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

      const shape = new Shape();
      for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
        const angle = Util.linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
        const y = -Math.cos( angle ) * WAVE_HEIGHT;
        const x = Util.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
        if ( i === 0 ) {
          if ( disturbanceType === Scene.DisturbanceType.PULSE ) {
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
      if ( disturbanceType === Scene.DisturbanceType.PULSE ) {
        shape.lineToRelative( MARGIN, 0 );
      }

      // In the pulse button, there is a white stroke
      const child = options.stroked ?
                    new Path( shape.getStrokedShape( new LineStyles( { lineWidth: 6 } ) ), {
                      fill: 'black',
                      stroke: 'white',
                      lineWidth: 2.5
                    } ) :
                    new Path( shape, {
                      stroke: 'black',
                      lineWidth: 2
                    } );
      this.addChild( child );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'DisturbanceTypeIconNode', DisturbanceTypeIconNode );
} );