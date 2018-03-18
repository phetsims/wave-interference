// Copyright 2018, University of Colorado Boulder

/**
 * Constants for the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  var WaveInterferenceConstants = {
    WAVE_AREA_WIDTH: 500, // TODO: Make it so we can update this number and everything reflows

    // These constants are used for the NumberControls to give them a consistent looks
    NUMBER_CONTROL_OPTIONS: {
      trackSize: new Dimension2( 100, 3 ),
      majorTickLength: 12,
      valuePattern: '{0} nm',
      thumbSize: new Dimension2( 22, 30 ), // TODO: match with other sliders in SlitsControlPanel
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    }
  };

  waveInterference.register( 'WaveInterferenceConstants', WaveInterferenceConstants );

  return WaveInterferenceConstants;
} );