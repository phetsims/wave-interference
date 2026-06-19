// Copyright 2018-2026, University of Colorado Boulder

/**
 * Shows the icons for the radio buttons that choose between pulse and continuous waves.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { linear } from '../../../../dot/js/util/linear.js';
import Shape from '../../../../kite/js/Shape.js';
import LineStyles from '../../../../kite/js/util/LineStyles.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import { DisturbanceType } from '../model/DisturbanceType.js';

// constants
const NUMBER_OF_SAMPLES = 100;           // Number of samples to take along the curve
const WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
const MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
const MARGIN = 10;                       // Width of the pulse side segments, in pixels
const WIDTH = 50;                        // Size of wave, in pixels

type SelfOptions = {

  // whether the wave is shown with a white stroke (used for the pulse button)
  stroked?: boolean;
};
export type DisturbanceTypeIconNodeOptions = SelfOptions & NodeOptions;

class DisturbanceTypeIconNode extends Node {

  public constructor( disturbanceType: DisturbanceType, providedOptions?: DisturbanceTypeIconNodeOptions ) {

    const options = optionize<DisturbanceTypeIconNodeOptions, SelfOptions, NodeOptions>()( {
      stroked: false
    }, providedOptions );
    super();

    const minAngle = disturbanceType === 'pulse' ? Math.PI : 0;
    const minX = disturbanceType === 'pulse' ? MARGIN : 0;
    const maxX = disturbanceType === 'pulse' ? ( WIDTH - MARGIN ) : WIDTH;

    const shape = new Shape();
    for ( let i = 0; i < NUMBER_OF_SAMPLES; i++ ) {
      const angle = linear( 0, NUMBER_OF_SAMPLES - 1, minAngle, MAX_ANGLE, i );
      const y = -Math.cos( angle ) * WAVE_HEIGHT;
      const x = linear( minAngle, MAX_ANGLE, minX, maxX, angle );
      if ( i === 0 ) {
        if ( disturbanceType === 'pulse' ) {
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
    if ( disturbanceType === 'pulse' ) {
      shape.lineToRelative( MARGIN, 0 );
    }

    const { stroked, ...nodeOptions } = options;

    // In the pulse button, there is a white stroke
    const child = stroked ?
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

    this.mutate( nodeOptions );
  }
}

export default DisturbanceTypeIconNode;
