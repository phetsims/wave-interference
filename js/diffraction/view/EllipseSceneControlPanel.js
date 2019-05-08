// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for the EllipseScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionNumberControl = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionNumberControl' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );

  // strings
  const diameterString = require( 'string!WAVE_INTERFERENCE/diameter' );
  const eccentricityString = require( 'string!WAVE_INTERFERENCE/eccentricity' );
  const mmValueString = require( 'string!WAVE_INTERFERENCE/mmValue' );

  class EllipseSceneControlPanel extends WaveInterferencePanel {

    /**
     * @param {EllipseScene} ellipseScene
     * @param {Object} [options]
     */
    constructor( ellipseScene, options ) {
      super( new HBox( {
        spacing: WaveInterferenceConstants.DIFFRACTION_HBOX_SPACING,
        children: [
          new DiffractionNumberControl( diameterString, ellipseScene.diameterProperty, {
            delta: 50 * 1E-3,
            numberDisplayOptions: {
              valuePattern: mmValueString,
              decimalPlaces: 2
            },
            sliderOptions: {
              constrainValue: value => Util.roundToInterval( value, 10E-3 )
            }
          } ),
          new DiffractionNumberControl( eccentricityString, ellipseScene.eccentricityProperty, {
            delta: 0.01,
            numberDisplayOptions: {
              decimalPlaces: 2
            },
            sliderOptions: {

              // Constrain by 0.05 but do not exceed the max
              constrainValue: value => Math.min( Util.roundToInterval( value, 0.05 ), ellipseScene.eccentricityProperty.range.max )
            }
          } )
        ]
      } ), options );
    }
  }

  return waveInterference.register( 'EllipseSceneControlPanel', EllipseSceneControlPanel );
} );