// Copyright 2018-2020, University of Colorado Boulder

/**
 * Panel subclass that applies styling specific to the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Panel from '../../../../sun/js/Panel.js';
import waveInterference from '../../waveInterference.js';

class WaveInterferencePanel extends Panel {

  /**
   * @param {Node} content
   * @param {Object} [options]
   */
  constructor( content, options ) {
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