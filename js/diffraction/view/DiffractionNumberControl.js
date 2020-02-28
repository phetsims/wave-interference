// Copyright 2019-2020, University of Colorado Boulder

/**
 * Number controls for each scene in the diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';

class DiffractionNumberControl extends NumberControl {

  /**
   * @param {string} title
   * @param {Property.<number>} property
   * @param {Object} [options]
   */
  constructor( title, property, options ) {

    const mergedOptions = merge( {}, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS, {
      sliderOptions: {
        majorTicks: [ {
          value: property.range.min,
          label: new WaveInterferenceText( property.range.min.toFixed( 2 ) )
        }, {
          value: property.range.max,
          label: new WaveInterferenceText( property.range.max.toFixed( 2 ) )
        } ]
      }
    }, options );

    // make wider to give more room for layout and breathing room for i18n
    const expandedOptions = merge( mergedOptions, {
      sliderOptions: {
        trackSize: new Dimension2( 140, 1 ),
        thumbSize: new Dimension2( 13, 24.2 )
      },
      titleNodeOptions: {
        maxWidth: 130
      },
      numberDisplayOptions: {
        maxWidth: 80
      }
    } );
    super( title, property, property.range, expandedOptions );
  }
}

waveInterference.register( 'DiffractionNumberControl', DiffractionNumberControl );
export default DiffractionNumberControl;