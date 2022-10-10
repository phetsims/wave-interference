// Copyright 2018-2022, University of Colorado Boulder

/**
 * One probe for the WaveMeterNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import { DragListener, InteractiveHighlighting } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';

type SelfOptions = {
  dragStart?: () => void;
  drag?: () => void;
};

type WaveMeterProbeNodeOptions = SelfOptions & ProbeNodeOptions;

class WaveMeterProbeNode extends InteractiveHighlighting( ProbeNode ) {

  /**
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param [providedOptions]
   */
  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions?: WaveMeterProbeNodeOptions ) {

    const options = optionize<WaveMeterProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
      cursor: 'pointer',
      sensorTypeFunction: ProbeNode.crosshairs( { stroke: 'white' } ),
      scale: 0.4,
      dragStart: _.noop,
      drag: _.noop
    }, providedOptions );

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