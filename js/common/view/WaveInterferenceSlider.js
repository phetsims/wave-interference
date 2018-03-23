// Copyright 2018, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  var LABEL_OPTIONS = { fontSize: 10 };
  var MAX_TICK_INDEX = 10;

  /**
   * @param {Property} property
   * @param {number} min
   * @param {number} max
   * @constructor
   */
  function WaveInterferenceSlider( property, min, max ) {

    var tickIndex = 0;
    var nextTickValue = function() {
      return Util.linear( 0, MAX_TICK_INDEX, min, max, tickIndex++ );
    };
    var ticks = [
      { value: nextTickValue(), type: 'major', label: new WaveInterferenceText( '0', LABEL_OPTIONS ) },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'major' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'minor' },
      { value: nextTickValue(), type: 'major', label: new WaveInterferenceText( 'max', LABEL_OPTIONS ) }
    ];

    HSlider.call( this, property, {
      min: min, max: max
    }, {
      thumbSize: WaveInterferenceConstants.THUMB_SIZE,
      trackSize: new Dimension2( 150, 5 ),

      // ticks
      tickLabelSpacing: 2,
      majorTickLength: 15,
      minorTickLength: 8,
      constrainValue: function( value ) {

        // find the closest tick
        return _.minBy( ticks, function( tick ) {return Math.abs( tick.value - value );} ).value;
      }
    } );

    for ( var i = 0; i < ticks.length; i++ ) {
      var tick = ticks[ i ];
      if ( tick.type === 'major' ) {
        this.addMajorTick( tick.value, tick.label ); // Label is optional
      }
      else {
        this.addMinorTick( tick.value, tick.label ); // Label is optional
      }
    }
  }

  waveInterference.register( 'WaveInterferenceSlider', WaveInterferenceSlider );

  return inherit( HSlider, WaveInterferenceSlider );
} );