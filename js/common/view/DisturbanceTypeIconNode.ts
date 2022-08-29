// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Shows the icons for the radio buttons that choose between pulse and continuous waves.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { LineStyles, Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import Scene from '../model/Scene.js';

// constants
const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
const MARGIN = 10;                       // Width of the pulse side segments, in pixels
const WIDTH = 50;                        // Size of wave, in pixels

class DisturbanceTypeIconNode extends Node {

  public constructor( disturbanceType, options ) {

    options = merge( {
      stroked: false
    }, options );
    super();

    const minAngle = disturbanceType === Scene.DisturbanceType.PULSE ? Math.PI : 0;
    const minX = disturbanceType === Scene.DisturbanceType.PULSE ? MARGIN : 0;
    const maxX = disturbanceType === Scene.DisturbanceType.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

    const shape = new Shape();
    for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
      const angle = Utils.linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
      const y = -Math.cos( angle ) * WAVE_HEIGHT;
      const x = Utils.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
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

waveInterference.register( 'DisturbanceTypeIconNode', DisturbanceTypeIconNode );
export default DisturbanceTypeIconNode;