// Copyright 2018-2020, University of Colorado Boulder

/**
 * One probe for the WaveMeterNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import waveInterference from '../../waveInterference.js';

class WaveMeterProbeNode extends ProbeNode {

  /**
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the ScreenView
   * @param {Object} [options]
   */
  constructor( visibleBoundsProperty, options ) {

    options = merge( {
      cursor: 'pointer',
      sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
      scale: 0.4,
      drag: () => {}
    }, options );

    super( options );

    visibleBoundsProperty.link( visibleBounds => this.setCenter( visibleBounds.closestPointTo( this.center ) ) );

    this.addInputListener( new DragListener( {
      translateNode: true,
      dragBoundsProperty: visibleBoundsProperty,
      drag: () => options.drag()
    } ) );
  }
}

waveInterference.register( 'WaveMeterProbeNode', WaveMeterProbeNode );
export default WaveMeterProbeNode;