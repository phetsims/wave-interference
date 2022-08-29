// Copyright 2018-2021, University of Colorado Boulder
// @ts-nocheck
/**
 * One probe for the WaveMeterNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';

class WaveMeterProbeNode extends ProbeNode {

  /**
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param [options]
   */
  public constructor( visibleBoundsProperty, options ) {

    options = merge( {
      cursor: 'pointer',
      sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
      scale: 0.4,
      dragStart: () => {},
      drag: () => {}
    }, options );

    super( options );

    visibleBoundsProperty.link( visibleBounds => this.setCenter( visibleBounds.closestPointTo( this.center ) ) );

    this.addInputListener( new DragListener( {
      translateNode: true,
      dragBoundsProperty: visibleBoundsProperty,
      start: () => options.dragStart(),
      drag: () => options.drag()
    } ) );
  }
}

waveInterference.register( 'WaveMeterProbeNode', WaveMeterProbeNode );
export default WaveMeterProbeNode;