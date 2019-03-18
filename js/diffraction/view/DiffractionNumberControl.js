// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  // const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  // const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  const NUMBER_CONTROL_OPTIONS = _.extend( {}, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS, {
    // trackSize: new Dimension2( 100, 1 ),
    // valueFont: WaveInterferenceConstants.DEFAULT_FONT,
    // majorTickLength: MAJOR_TICK_LENGTH,
    // thumbSize: THUMB_SIZE,
    // layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 3 } ),
    // arrowButtonOptions: {
    //   scale: 0.65
    // },
    // titleFont: WaveInterferenceConstants.DEFAULT_FONT,
    // titleMaxWidth: 95,
    // valueMaxWidth: 65
  } );

  class DiffractionNumberControl extends NumberControl {

    /**
     * @param {string} title
     * @param {string} minLabel
     * @param {string} maxLabel
     * @param {Property.<number>} property
     * @param {Object} [options]
     */
    constructor( title, minLabel, maxLabel, property, options ) {

      // TODO: This hack/workaround addresses the problem described in https://github.com/phetsims/phet-info/issues/91#issuecomment-474008231
      // TODO: apparently the current implementation of merge changes all arguments except for the last one, so by putting
      // TODO: the shared values last, we can prevent them from leaking out.
      // TODO: It seems like options should be last.
      super( title, property, property.range, merge( {
        sliderOptions: {
          majorTicks: [ {

            // TODO: model coordinates for these
            value: property.range.min,
            label: new WaveInterferenceText( minLabel )
          }, {
            value: property.range.max,
            label: new WaveInterferenceText( maxLabel )
          } ]
        }
      }, options, NUMBER_CONTROL_OPTIONS ) );
    }
  }

  return waveInterference.register( 'DiffractionNumberControl', DiffractionNumberControl );
} );