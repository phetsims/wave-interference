// Copyright 2019, University of Colorado Boulder

/**
 * Number controls for each scene in the diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  class DiffractionNumberControl extends NumberControl {

    /**
     * @param {string} title
     * @param {Property.<number>} property
     * @param {Object} [options]
     */
    constructor( title, property, options ) {

      // Normally we would like to specify options last, however, at the time of writing, there is a problem that
      // https://github.com/phetsims/phet-info/issues/91#issuecomment-474008231 where all merge arguments are mutated
      // except the last one, hence we specify the shared value last.
      const mergedOptions = merge( {
        sliderOptions: {
          majorTicks: [ {
            value: property.range.min,
            label: new WaveInterferenceText( property.range.min )
          }, {
            value: property.range.max,
            label: new WaveInterferenceText( property.range.max )
          } ]
        }
      }, options, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS );

      // TODO: Should we reduce the widths now that we are no longer using long "Diamond Side Length" string?
      // make wider to accommodate Diamond Side Length string.
      const expandedOptions = merge( mergedOptions, {
        sliderOptions: {
          trackSize: new Dimension2( 140, 1 )
        },
        titleNodeOptions: {
          maxWidth: 140
        }
      } );
      super( title, property, property.range, expandedOptions );
    }
  }

  return waveInterference.register( 'DiffractionNumberControl', DiffractionNumberControl );
} );