// Copyright 2018-2022, University of Colorado Boulder

/**
 * Panel subclass that applies styling specific to the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';

export type WaveInterferencePanelOptions = PanelOptions;

class WaveInterferencePanel extends Panel {

  public constructor( content: Node, options?: PanelOptions ) {
    options = merge( {
      yMargin: 7,
      xMargin: 10,
      stroke: 'gray',
      fill: 'rgb(230,231,232)',
      cornerRadius: 6
    }, options );
    super( content, options );
  }
}

waveInterference.register( 'WaveInterferencePanel', WaveInterferencePanel );
export default WaveInterferencePanel;